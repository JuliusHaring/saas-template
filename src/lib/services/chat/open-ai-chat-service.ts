import { ChatBot } from "@prisma/client";
import { IChatService } from "./i-chat-service";
import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";

export class AssistantNotFoundException extends Error {}
export class ThreadStatusError extends Error {}
export class MessageTypeError extends Error {}

export class OpenAIChatService extends IChatService {
  private client: OpenAI;
  private threads: Map<string, { threadId: string; expiresAt: number }>;

  private constructor() {
    super();
    this.client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
    this.threads = new Map();
    this.startCleanupRoutine();
  }

  async _chatWithThread(
    assistantId: ChatBot["assistantId"],
    sessionId: string,
    promptMessage: string,
  ): Promise<string> {
    const thread = await this.getThread(sessionId);

    await this.client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: promptMessage,
    });

    const run = await this.client.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = run.status;
    const pollInterval = 200;
    const timeout = 60 * 1000;
    const startTime = Date.now();

    while (["queued", "in_progress"].includes(runStatus)) {
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
