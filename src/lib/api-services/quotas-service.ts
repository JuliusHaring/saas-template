import {
  createOrUpdateUserUsage,
  getUserSubscription,
  getOrCreateUserUsage,
} from "@/lib/db/stripe";
import { ChatBotService } from "./chatbot-service";
import { ChatBotIdType, SubscriptionTierValues, UserIdType } from "../db/types";
import Stripe from "stripe";
import { SubscriptionTier } from "@/lib/db/types";
import { StripeService } from "./stripe-service";

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
>;

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

  private constructor() {
    this.stripeService = StripeService.Instance;
    this.chatbotService = ChatBotService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
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

    const getUsage = async (quota: Quota) =>
      getOrCreateUserUsage(userId).then((uQ) => uQ[quota]);

    await Promise.all(
      allQuotas.map(async (quota) => {
        const usage = await getUsage(quota);
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
    const usage = (await getOrCreateUserUsage(userId))!;

    const quotaUsage: QuotaUsageType = Object.fromEntries(
      Object.entries(quotas).map(([key, limit]) => {
        const quotaKey = key as Quota;
        const used = usage[quotaKey] ?? 0;
        const reached = used >= limit;
        const remaining = Math.max(limit - used, 0);
        return [quotaKey, { limit, used, reached, remaining }];
      }),
    ) as QuotaUsageType;

    return quotaUsage;
  }

  public async getUserQuotaRemainder(
    userId: UserIdType,
    quota: Quota,
  ): Promise<number> {
    const userQuotas = await this.getUserQuotas(userId);
    const userQuotaValue = userQuotas[quota];

    const userUsage = await getOrCreateUserUsage(userId);
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

    const currentUsage = await getOrCreateUserUsage(userId);

    if (currentUsage !== null) {
      currentValue = currentUsage[quota];
    }

    const update = { [quota]: value + currentValue };
    return createOrUpdateUserUsage(userId, update);
  }

  async getChatBotQuotaRemainder(chatBotId: ChatBotIdType, quota: Quota) {
    const userId = await this.chatbotService.getUserIdOfChatbot(chatBotId);
    return this.getUserQuotaRemainder(userId, quota);
  }

  async updateChatbotUsage(
    chatBotId: ChatBotIdType,
    quota: Quota,
    value: number,
  ) {
    const userId = await this.chatbotService.getUserIdOfChatbot(chatBotId);
    return this.updateUserUsage(userId, quota, value);
  }
}
