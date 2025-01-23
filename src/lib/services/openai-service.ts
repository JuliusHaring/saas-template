import { ChatBot } from "@prisma/client";
import { OpenAI } from "openai";
import { QuotaService } from "./quotas-service";
import { TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { RAGService } from "./rag/rag-service";
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
      model: "gpt-4o-mini",
      metadata: { userId },
      ...createAssistant,
    });
  }

  public async getAssistants(userId: ChatBot["userId"]) {
    return this.client.beta.assistants.list().then((assistants) => {
      return assistants.data.filter(
        (assistant) =>
          (assistant.metadata! as { userId: string }).userId === userId,
      );
    });
  }

  public async countAssistants(userId: ChatBot["userId"]) {
    return this.getAssistants(userId).then((arr) => arr.length);
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

export class OpenAIEmbeddingService {
  private static _instance: OpenAIEmbeddingService;
  private client: OpenAI;

  private constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async embedText(
    text: string | string[],
  ): Promise<OpenAI.Embeddings.Embedding["embedding"][]> {
    return this.client.embeddings
      .create({
        input: text,
        model: "text-embedding-ada-002",
      })
      .then((r) => r.data.map((d) => d.embedding));
  }
}

export class OpenAIChatService {
  private static _instance: OpenAIChatService;
  private client: OpenAI;
  private threads: Map<string, { threadId: string; expiresAt: number }>;
  private ragService: RAGService;
  private promptService: PromptService;

  private constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
    this.threads = new Map();
    this.startCleanupRoutine();
    this.ragService = RAGService.Instance;
    this.promptService = PromptService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getThread(
    sessionId: string,
  ): Promise<OpenAI.Beta.Threads.Thread> {
    const threadData = this.threads.get(sessionId);

    if (threadData?.threadId) {
      return this.client.beta.threads.retrieve(threadData.threadId);
    }

    const thread = await this.client.beta.threads.create();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now
    this.threads.set(sessionId, { threadId: thread.id, expiresAt });
    return thread;
  }

  private async getTextMessages(messages: OpenAI.Beta.Threads.MessagesPage) {
    const messageContents = messages.data.map((m) => m.content);
    if (messageContents.filter((mC) => mC[0].type !== "text").length > 0) {
      throw new MessageTypeError();
    }

    return messageContents.map((mC) => (mC[0] as TextContentBlock).text.value);
  }

  public async getThreadMessages(sessionId: string) {
    const thread = await this.getThread(sessionId);
    const messages = await this.client.beta.threads.messages.list(thread.id);

    return this.getTextMessages(messages);
  }

  public async chatWithThread(
    assistantId: string,
    sessionId: string,
    userMessage: string,
  ): Promise<string> {
    const sources = await this.ragService.findClosest(userMessage);

    const thread = await this.getThread(sessionId);

    const message = await this.client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await this.client.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = run.status;
    const pollInterval = 200;
    const timeout = 60 * 1000;
    const startTime = Date.now();

    while (["queued", "in_progress"].includes(run.status)) {
      if (Date.now() - startTime > timeout) {
        throw new Error("Run polling timed out.");
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      const updatedRun = await this.client.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );
      runStatus = updatedRun.status;
    }

    if (run.status !== "completed") {
      throw new ThreadStatusError();
    }

    const retrievedMessages = await this.client.beta.threads.messages.list(
      thread.id,
    );
    const messages = await this.getTextMessages(retrievedMessages);

    return messages[0];
  }

  public async deleteThread(sessionId: string) {
    const thread = await this.getThread(sessionId);
    await this.client.beta.threads.del(thread.id).then(() => {
      this.threads.delete(sessionId);
    });
  }

  private startCleanupRoutine(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [sessionId, threadData] of this.threads.entries()) {
        if (threadData.expiresAt <= now) {
          this.threads.delete(sessionId);
        }
      }
    }, 60 * 1000); // Run cleanup every 1 minute
  }
}
