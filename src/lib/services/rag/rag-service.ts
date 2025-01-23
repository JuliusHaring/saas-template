import { ChatBot, WebsiteSourceOptions } from "@prisma/client";
import {
  createGDriveSourceOptions,
  CreateGDriveSourceOptionsType,
  createWebsiteSourceOptions,
  CreateWebsiteSourceOptionsType,
  getWebsiteSourceOptions,
} from "@/lib/db/chatbot";

export class RAGService {
  private static _instance: RAGService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createGDriveSourceOptions(
    assistantId: ChatBot["assistantId"],
    data: CreateGDriveSourceOptionsType,
  ) {
    return createGDriveSourceOptions(assistantId, data);
  }

  public async createWebsiteSourceOptions(
    assistantId: ChatBot["assistantId"],
    data: CreateWebsiteSourceOptionsType,
  ) {
    return createWebsiteSourceOptions(assistantId, data);
  }

  public async getWebsiteSourceOptions(
    assistantId: WebsiteSourceOptions["assistantId"],
    userId: ChatBot["assistantId"],
  ) {
    return getWebsiteSourceOptions(assistantId, userId);
  }
}
