import { SubscriptionTier } from "@/lib/db/stripe";
import { StripeService } from "./stripe-service";

export class QuotaReachedException extends Error {}

export enum Quota {
  MAX_FILES = "maxFiles",
  MAX_CHATS = "maxChats",
}

export type TierQuotaMap = Map<Quota, number>;

export class QuotaService {
  private static _instance: QuotaService;

  private stripeService: StripeService;

  private constructor() {
    this.stripeService = StripeService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getTierQuotas(tier: SubscriptionTier): Promise<TierQuotaMap> {
    const price = await this.stripeService.getPrice(tier);
    const quotaMap: TierQuotaMap = new Map();

    for (const quota of Object.values(Quota)) {
      const value = price.metadata[quota];
      if (value !== undefined) {
        quotaMap.set(quota, parseInt(value, 10));
      } else {
        console.warn(
          `Quota ${quota} is missing in price metadata for tier ${tier}`,
        );
      }
    }

    return quotaMap;
  }
}
