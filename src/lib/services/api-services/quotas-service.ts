import {
  createOrUpdateUserUsage,
  getUserSubscription,
  getUsage,
} from "@/lib/db/stripe";
import Stripe from "stripe";
import {
  SubscriptionTier,
  SubscriptionTierValues,
  UserIdType,
} from "@/lib/db/types";
import { ChatBotService } from "@/lib/services/api-services/chatbot-service";
import { StripeService } from "@/lib/services/api-services/stripe-service";

export class QuotaException extends Error {}

export class QuotaReachedException extends QuotaException {
  constructor(quota: Quota) {
    super(`Quota reached: ${quota}`);
  }
}

export class QuotaNotFoundException extends QuotaException {
  constructor(quota: Quota, product: Stripe.Product) {
    super(`Quota ${quota} not found in product ${product.name}`);
  }
}

export enum Quota {
  MAX_FILES = "fileCount",
  MAX_CHAT_MESSAGES = "chatMessages",
}

export type QuotaUsageType = Record<
  Quota,
  { limit: number; used: number; reached: boolean; remaining: number }
> & { lastResetAt: Date };

export type QuotasTierLimits = {
  quota: Quota;
  usage: number;
  limits: {
    tier: SubscriptionTier;
    limit: number;
  }[];
};

export type QuotasTierLimitsInfo = {
  userTier: SubscriptionTier;
  quotasTierLimits: QuotasTierLimits[];
};

export class QuotaService {
  private static _instance: QuotaService;

  private stripeService: StripeService;
  private chatbotService: ChatBotService;

  private constructor(stripeService: StripeService) {
    this.stripeService = stripeService;
    this.chatbotService = ChatBotService.Instance;
  }

  public static async getInstance(): Promise<QuotaService> {
    if (!this._instance) {
      const stripeService = await StripeService.getInstance();
      this._instance = new this(stripeService);
    }
    return this._instance;
  }

  private async _getTierQuotas(tier: SubscriptionTier) {
    const product = await this.stripeService.getProductByTier(tier);
    const quotaMap: Map<Quota, number> = new Map();

    for (const quota of Object.values(Quota)) {
      const value = product.metadata[quota];
      if (value !== undefined) {
        quotaMap.set(quota, parseInt(value, 10));
      } else {
        throw new QuotaNotFoundException(quota, product);
      }
    }

    return Object.fromEntries(quotaMap) as Record<string, number>;
  }

  private async _getAllTierQuotas() {
    return Promise.all(
      SubscriptionTierValues.map((tier) => this._getTierQuotas(tier)),
    );
  }

  public async getTierQuotasLimitInfo(
    userId: UserIdType,
  ): Promise<QuotasTierLimitsInfo> {
    const quotasTierLimits: QuotasTierLimits[] = [];

    const allQuotas = Object.values(Quota);
    const tierQuotas = await this._getAllTierQuotas();

    const getUsageForUserId = async (quota: Quota) =>
      getUsage(userId).then((uQ) => uQ[quota]);

    await Promise.all(
      allQuotas.map(async (quota) => {
        const usage = await getUsageForUserId(quota);
        quotasTierLimits.push({
          quota,
          usage,
          limits: tierQuotas.map((q, i) => ({
            tier: SubscriptionTierValues[i],
            limit: q[quota],
          })),
        });
      }),
    );

    const userSubscription =
      await this.stripeService.getUserSubscription(userId);

    return {
      userTier: userSubscription.tier,
      quotasTierLimits,
    };
  }

  public async getUserQuotas(userId: UserIdType) {
    const userSubscription = await getUserSubscription(userId);
    const quotas = await this._getTierQuotas(userSubscription.tier);
    return quotas;
  }

  public async getUserQuotasWithRemainder(userId: UserIdType) {
    const quotas = await this.getUserQuotas(userId);
    const usage = (await getUsage(userId))!;

    const quotaUsage: QuotaUsageType = {
      lastResetAt: usage.lastResetAt,
      ...Object.values(Quota).reduce(
        (acc, quotaKey) => {
          const limit = quotas[quotaKey] ?? 0;
          const used = usage[quotaKey] ?? 0;
          const reached = used >= limit;
          const remaining = Math.max(limit - used, 0);

          acc[quotaKey] = { limit, used, reached, remaining };
          return acc;
        },
        {} as Record<
          Quota,
          { limit: number; used: number; reached: boolean; remaining: number }
        >,
      ),
    };

    return quotaUsage;
  }

  public async getUserQuotaRemainder(
    userId: UserIdType,
    quota: Quota,
  ): Promise<number> {
    const userQuotas = await this.getUserQuotas(userId);
    const userQuotaValue = userQuotas[quota];

    const userUsage = await getUsage(userId);
    const userUsageValue = userUsage![quota];
    const res = userQuotaValue - userUsageValue;

    if (res <= 0) {
      throw new QuotaReachedException(quota);
    }

    return res;
  }

  public async updateUserUsage(
    userId: UserIdType,
    quota: Quota,
    value: number,
  ) {
    let currentValue = 0;

    const currentUsage = await getUsage(userId);

    if (currentUsage !== null) {
      currentValue = currentUsage[quota];
    }

    const update = { [quota]: value + currentValue };
    return createOrUpdateUserUsage(userId, update);
  }
}
