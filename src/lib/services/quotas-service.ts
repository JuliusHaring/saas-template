import {
  createOrUpdateUserUsage,
  getUserSubscription,
  getUserUsage,
  SubscriptionTier,
} from "@/lib/db/stripe";
import { ChatBotService } from "./chatbot-service";
import { StripeService } from "./stripe-service";
import { ChatBotIdType, UserIdType } from "../db/types";

export class QuotaReachedException extends Error {
  constructor(quota: Quota) {
    super(`Quota reached: ${quota}`);
  }
}

export enum Quota {
  MAX_FILES = "fileCount",
  MAX_CHAT_MESSAGES = "chatMessages",
}

export type TierQuotaMap = Map<Quota, number>;

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

  private async _getTierQuotas(tier: SubscriptionTier): Promise<TierQuotaMap> {
    const product = await this.stripeService.getProductByTier(tier);
    const quotaMap: TierQuotaMap = new Map();

    for (const quota of Object.values(Quota)) {
      const value = product.metadata[quota];
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

  public async getUserQuotas(userId: UserIdType) {
    const userSubscription = await getUserSubscription(userId);
    return this._getTierQuotas(userSubscription.tier);
  }

  public async getUserQuotaRemainder(
    userId: UserIdType,
    quota: Quota,
    raise: boolean = false,
  ): Promise<number> {
    const userQuotas = await this.getUserQuotas(userId);
    const userQuotaValue = userQuotas.get(quota)!;

    const userUsage = await getUserUsage(userId);
    const userUsageValue = userUsage![quota];
    const res = userQuotaValue - userUsageValue;

    if (raise && res <= 0) {
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

    const currentUsage = await getUserUsage(userId, false);

    if (currentUsage !== null) {
      currentValue = currentUsage[quota];
    }

    const update = { [quota]: value + currentValue };
    return createOrUpdateUserUsage(userId, update);
  }

  async getChatBotQuotaRemainder(
    chatBotId: ChatBotIdType,
    quota: Quota,
    raise: boolean = false,
  ) {
    const userId = await this.chatbotService.getUserIdOfChatbot(chatBotId);
    return this.getUserQuotaRemainder(userId, quota, raise);
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
