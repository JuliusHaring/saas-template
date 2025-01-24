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
}
