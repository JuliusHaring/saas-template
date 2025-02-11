import {
  createOrUpdateSubscription,
  deleteSubscription,
  getUserSubscription,
  hasActiveSubscription,
} from "@/lib/db/stripe";
import Stripe from "stripe";
import { GetUserType } from "../db/user";
import { baseUrl } from "../utils/base-url";
import { SubscriptionTier, SubscriptionType, UserIdType } from "../db/types";

export class StripeProductInitException extends Error {}
export class SubscriptionTierNotFoundException extends Error {}
export class StripeCustomerEmailMissingException extends Error {}

export class StripeService {
  private static _instance: StripeService;
  private stripe: Stripe;

  private productBasic!: Stripe.Product;
  private productPremium!: Stripe.Product;
  private productEnterprise!: Stripe.Product;

  private constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  public async init(): Promise<void> {
    try {
      this.productBasic = await this.stripe.products.retrieve(
        process.env.STRIPE_PRODUCT_BASIC_ID!,
      );
      this.productPremium = await this.stripe.products.retrieve(
        process.env.STRIPE_PRODUCT_PREMIUM_ID!,
      );
      this.productEnterprise = await this.stripe.products.retrieve(
        process.env.STRIPE_PRODUCT_ENTERPRISE_ID!,
      );
    } catch (err) {
      console.error("Error initializing Stripe products:", err);
      throw new StripeProductInitException();
    }
  }

  public static get Instance() {
    if (typeof this._instance !== "undefined") {
      return this._instance;
    }

    this._instance = new this();
    this._instance.init();
    return this._instance;
  }

  getProductByTier(tier: SubscriptionTier): Stripe.Product {
    switch (tier) {
      case "BASIC":
        return this.productBasic;
      case "PRO":
        return this.productPremium;
      case "ENTERPRISE":
        return this.productEnterprise;
    }
    throw Error(`Subscription ${tier} not found`);
  }

  async getTierBySubscription(
    subscription: Stripe.Subscription,
  ): Promise<SubscriptionTier> {
    const price = subscription.items.data[0]?.price;
    const product = await this.stripe.products.retrieve(
      price.product as string,
    );
    switch (product.id) {
      case this.productBasic.id:
        return "BASIC";
      case this.productPremium.id:
        return "PRO";
      case this.productEnterprise.id:
        return "ENTERPRISE";
    }

    throw new SubscriptionTierNotFoundException();
  }

  // async getPrice(tier: SubscriptionTier) {
  //   const priceId = this._getProductByTier(tier).default_price as Stripe.Price["id"];
  //   return this.stripe.prices.retrieve(priceId);
  // }

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

    if (typeof customer.email === "undefined" || !customer.email) {
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
      return_url: `${baseUrl}/admin`,
    });
  }
}
