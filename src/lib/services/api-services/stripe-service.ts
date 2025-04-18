import {
  createOrUpdateSubscription,
  deleteSubscription,
  getUserSubscription,
  hasActiveSubscription,
} from "@/lib/db/stripe";
import { UserIdType, SubscriptionType } from "@/lib/db/types";
import { GetUserType } from "@/lib/db/user";
import {
  NEXT_PUBLIC_BASE_URL,
  STRIPE_PRODUCT_BASIC_ID,
  STRIPE_PRODUCT_ENTERPRISE_ID,
  STRIPE_PRODUCT_PREMIUM_ID,
  STRIPE_SECRET_KEY,
} from "@/lib/utils/environment";
import { SubscriptionTier } from "@prisma/client";
import Stripe from "stripe";

export class StripeProductInitException extends Error {}
export class SubscriptionTierNotFoundException extends Error {}
export class StripeCustomerEmailMissingException extends Error {}
export class PriceNotFoundException extends Error {
  constructor(product?: Stripe.Product) {
    super(`The product ${product?.name} has no "default_price"`);
  }
}

export type ProductDescriptionType = {
  name: string;
  marketingFeatures: string[];
  priceEUR: number;
  hasTestPhase?: boolean;
  isHighlighted?: boolean;
};

export class StripeService {
  private static _instance: StripeService;
  private stripe: Stripe;

  private productBasic?: Stripe.Product;
  private productPremium?: Stripe.Product;
  private productEnterprise?: Stripe.Product;

  private constructor() {
    this.stripe = new Stripe(STRIPE_SECRET_KEY);
  }

  public static async getInstance(): Promise<StripeService> {
    if (!this._instance) {
      this._instance = new this();
      await this._instance.init();
    }
    return this._instance;
  }

  private async init(): Promise<void> {
    if (this.productBasic && this.productPremium && this.productEnterprise) {
      return; // Already initialized
    }

    try {
      [this.productBasic, this.productPremium, this.productEnterprise] =
        await Promise.all([
          this.stripe.products.retrieve(STRIPE_PRODUCT_BASIC_ID),
          this.stripe.products.retrieve(STRIPE_PRODUCT_PREMIUM_ID),
          this.stripe.products.retrieve(STRIPE_PRODUCT_ENTERPRISE_ID!),
        ]);
    } catch (err) {
      console.error("Error initializing Stripe products:", err);
      throw new StripeProductInitException();
    }
  }

  getProductByTier(tier: SubscriptionTier): Stripe.Product {
    if (!this.productBasic || !this.productPremium || !this.productEnterprise) {
      throw new StripeProductInitException();
    }

    switch (tier) {
      case "BASIC":
        return this.productBasic;
      case "PREMIUM":
        return this.productPremium;
      case "ENTERPRISE":
        return this.productEnterprise;
    }
    throw new SubscriptionTierNotFoundException();
  }

  public async getProductDescriptions(): Promise<ProductDescriptionType[]> {
    return Promise.all(
      [this.productBasic, this.productPremium, this.productEnterprise].map(
        async (product) => {
          if (!product?.default_price) {
            throw new PriceNotFoundException(product);
          }
          const price = await this.stripe.prices.retrieve(
            product!.default_price as string,
          );
          const marketingFeatures = product!.marketing_features.map(
            (mF) => mF.name!,
          );
          return {
            name: product!.name,
            marketingFeatures,
            priceEUR: price.unit_amount! / 100,
            hasTestPhase: !product!.name.toLowerCase().includes("basic"),
            isHighlighted: product!.name.toLowerCase().includes("premium"),
          };
        },
      ),
    );
  }

  async getTierBySubscription(
    subscription: Stripe.Subscription,
  ): Promise<SubscriptionTier> {
    if (!this.productBasic || !this.productPremium || !this.productEnterprise) {
      throw new StripeProductInitException();
    }

    const price = subscription.items.data[0]?.price;
    const product = await this.stripe.products.retrieve(
      price.product as string,
    );

    switch (product.id) {
      case this.productBasic.id:
        return "BASIC";
      case this.productPremium.id:
        return "PREMIUM";
      case this.productEnterprise.id:
        return "ENTERPRISE";
    }

    throw new SubscriptionTierNotFoundException();
  }

  constructEvent(
    body: string,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
  }

  private async _getCustomerForSubscription(
    subscription: Stripe.Subscription,
  ): Promise<Stripe.Customer> {
    const customerId: string = subscription.customer as string;
    return (await this.stripe.customers.retrieve(
      customerId,
    )) as Stripe.Customer;
  }

  private async _getEmailForSubscription(
    subscription: Stripe.Subscription,
  ): Promise<string> {
    const customer = await this._getCustomerForSubscription(subscription);

    if (!customer.email) {
      throw new StripeCustomerEmailMissingException();
    }
    return customer.email;
  }

  async getUserSubscription(userId: UserIdType): Promise<SubscriptionType> {
    return getUserSubscription(userId);
  }

  async createOrUpdateSubscription(subscription: Stripe.Subscription) {
    const email = await this._getEmailForSubscription(subscription);
    const subscriptionTier = await this.getTierBySubscription(subscription);

    await createOrUpdateSubscription(email, subscription, subscriptionTier);
  }

  async deleteSubscription(subscription: Stripe.Subscription) {
    const email = await this._getEmailForSubscription(subscription);
    await deleteSubscription(email);
  }

  async hasActiveSubscription(userId: UserIdType): Promise<boolean> {
    return hasActiveSubscription(userId);
  }

  async createBillingSession(user: GetUserType) {
    return this.stripe.billingPortal.sessions.create({
      customer: user.Subscription!.customerId,
      return_url: `${NEXT_PUBLIC_BASE_URL}/dashboard`,
    });
  }
}
