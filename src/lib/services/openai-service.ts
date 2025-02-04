import { ChatBot, User } from "@prisma/client";
import { OpenAI } from "openai";
import { PromptService } from "./prompt-service";

export class AssistantNotFoundException extends Error {}
export class ThreadStatusError extends Error {}
export class MessageTypeError extends Error {}

export type CreateAssistantType = Omit<
  OpenAI.Beta.Assistants.AssistantCreateParams,
  "model" | "metadata"
>;

export type UpdateAssistantType = OpenAI.Beta.Assistants.AssistantUpdateParams;

export class OpenAIService {
  private static _instance: OpenAIService;

  private client!: OpenAI;
  private promptService: PromptService;

  private constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
    this.promptService = PromptService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createAssistant(
    userId: User["id"],
    createAssistant: CreateAssistantType,
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    createAssistant.instructions = this.promptService.generateAssistantPrompt(
      createAssistant.instructions || "",
    );

    return this.client.beta.assistants.create({
      model: "gpt-4o-mini",
      metadata: { userId },
      ...createAssistant,
    });
  }

  public async deleteAssistant(assistantId: ChatBot["assistantId"]) {
    return this.client.beta.assistants.del(assistantId);
  }

  public async getAssistants(userId: User["id"]) {
    return this.client.beta.assistants.list().then((assistants) => {
      return assistants.data.filter(
        (assistant) =>
          (assistant.metadata! as { userId: string }).userId === userId,
      );
    });
  }

  public async countAssistants(userId: User["id"]) {
    return this.getAssistants(userId).then((arr) => arr.length);
  }

  public async getAssistant(
    assistantId: ChatBot["assistantId"],
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    try {
      return this.client.beta.assistants.retrieve(assistantId);
    } catch (e) {
      console.error(e);
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
