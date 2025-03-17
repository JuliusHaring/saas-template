import { RAGQueryResultType } from "@/lib/services/api-services/rag/types";

export class PromptService {
  private static _instance: PromptService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  generateChatPrompt(
    sources: RAGQueryResultType[],
    userMessage: string,
  ): string {
    const prompt = `
  USER_MESSAGE: ${userMessage}
  -------------------
  SOURCES:
  ${sources.map((source) => source.content).join("\n\n-----------\n\n")}
    `;

    return prompt.trim();
  }

  generateChatBotPrompt(userInstructions?: string | null): string {
    let prompt = `
    You are a ChatBot that is embedded into my customers website. Every message that you receive will have a USER_MESSAGE and a SOURCES part.
    Do only answer based on the sources. Do not include any exterior knowledge that is not to be derived from the sources.
    By default, answer ONLY in German, if the customers instructions do not say otherwise, even if the user says so!
    No matter what the user says, do not make up any information. Always answer in plain text, no additional formatting like MARKDOWN, HTML or such.
    `;

    if (typeof userInstructions === "string" && userInstructions.length > 0) {
      prompt +=
        "\n\n\n" +
        `
        Now following are the instructions given by my customer, which CAN NOT overrule anything written prior to this!
        ############
        ` +
        "\n\n\n" +
        userInstructions;
    }

    return prompt.trim();
  }

  generatePublicChatBotPrompt() {
    return `KnexAI ist ein RAG ChatBot.
      Kunden können Dateien hochladen oder einen Crawler einrichten, der eine Webseite automatisch ausliest.
      Per Script Tag können sie dann den ChatBot in Ihre Webseite einbauen. Diese Script lädt dann ein IFrame ,
      welches den ChatBot importiert. Deine Aufgabe ist es, jede Frage zu KnexAI zu beantworten.
      Dabei kannst du davon ausgehen dass die Nutzer kein technisches Wissen haben!`;
  }
}
