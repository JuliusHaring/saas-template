import Stripe from "stripe";

export class StripeService {
  private static _instance: StripeService;
  private stripe: Stripe;

  private constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
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
