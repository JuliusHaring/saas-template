import { ChatBot } from "@prisma/client";
import { OpenAI } from "openai";
import { QuotaService } from "./quotas-service";

export class AssistantNotFoundException extends Error {}

export type CreateAssistantType = Omit<
  OpenAI.Beta.Assistants.AssistantCreateParams,
  "model" | "metadata"
>;

export type UpdateAssistantType = OpenAI.Beta.Assistants.AssistantUpdateParams;

export class OpenAIService {
  private static _instance: OpenAIService;

  private client!: OpenAI;
  private quotaService!: QuotaService;

  private constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
    this.quotaService = QuotaService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createAssistant(
    userId: ChatBot["userId"],
    createAssistant: CreateAssistantType,
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    const assistantCount = await this.countAssistants(userId);
    this.quotaService.assessQuota("USER_ASSISTANT_COUNT", assistantCount + 1);

    return this.client.beta.assistants.create({
      model: "gpt-3.5-turbo-16k",
      metadata: { userId },
      ...createAssistant,
    });
  }

  public async countAssistants(userId: ChatBot["assistantId"]) {
    return this.client.beta.assistants.list().then((assistants) => {
      return assistants.data.filter(
        (assistant) =>
          (assistant.metadata! as { userId: string }).userId === userId,
      ).length;
    });
  }

  public async getAssistant(
    assistantId: ChatBot["assistantId"],
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    try {
      return this.client.beta.assistants.retrieve(assistantId);
    } catch (e) {
      throw new AssistantNotFoundException();
    }
  }

  public async updateAssistant(
    assistantId: ChatBot["assistantId"],
    data: UpdateAssistantType,
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    return this.client.beta.assistants.update(assistantId, data);
  }
}
