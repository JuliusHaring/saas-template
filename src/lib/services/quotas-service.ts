import {
  createOrUpdateUserUsage,
  getUserSubscription,
  getUserUsage,
  SubscriptionTier,
} from "@/lib/db/stripe";
import { ChatBot, Subscription } from "@prisma/client";
import { ChatBotService } from "./chatbot-service";
import { StripeService } from "./stripe-service";

export class QuotaReachedException extends Error {}

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

  public async getUserQuotas(userId: Subscription["userId"]) {
    const userSubscription = await getUserSubscription(userId);
    return this._getTierQuotas(userSubscription.tier);
  }

  public async updateUserUsage(
    userId: Subscription["userId"],
    quota: Quota,
    value: number,
  ) {
    let currentValue = 0;
    try {
      const currentUsage = await getUserUsage(userId);
      currentValue = currentUsage[quota];
    } catch (e) {
      console.log(
        `Found no Usage for user ${userId}, this will subsequently be created`,
      );
    }

    const update = { [quota]: value + currentValue };
    return createOrUpdateUserUsage(userId, update);
  }

  async updateAssistantUsage(
    assistantId: ChatBot["assistantId"],
    quota: Quota,
    value: number,
  ) {
    const userId = await this.chatbotService.getUserIdOfChatbot(assistantId);
    return this.updateUserUsage(userId, quota, value);
  }
}
