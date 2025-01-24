import { SubscriptionTier } from "@/lib/db/stripe";
import Stripe from "stripe";

export class StripeProductInitException extends Error {}

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

  private _getProductByTier(tier: SubscriptionTier): Stripe.Product {
    switch (tier) {
      case "BASIC":
        return this.productBasic;
      case "PRO":
        return this.productPremium;
      case "ENTERPRISE":
        return this.productEnterprise;
    }
  }

  async getPrice(tier: SubscriptionTier) {
    const price = this._getProductByTier(tier).default_price as Stripe.Price;
    return this.stripe.prices.retrieve(price.id);
  }

  constructEvent(
    body: string,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
  }

  handleSubscription(subscription: Stripe.Subscription) {
    throw new Error("Method not implemented.");
  }
}
