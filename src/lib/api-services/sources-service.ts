import { createWebsiteSource, getSources } from "../db/source";
import {
  ChatBotIdType,
  CreateWebsiteSourceType,
  UserIdType,
} from "../db/types";

export class SourcesService {
  private static _instance: SourcesService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new SourcesService());
  }

  async getSources(userId: UserIdType) {
    return getSources(userId);
  }

  async createWebsiteSource(
    userId: UserIdType,
    chatBotId: ChatBotIdType,
    websiteSourceCreate: CreateWebsiteSourceType,
  ) {
    return createWebsiteSource(userId, chatBotId, websiteSourceCreate);
  }
}
