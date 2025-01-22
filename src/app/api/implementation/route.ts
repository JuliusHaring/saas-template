import { OpenAIService } from "@/lib/services/openai-service";
import { v4 as uuidv4 } from "uuid";

const openAIService = OpenAIService.Instance;

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { assistantId, sessionId: providedSessionId, userMessage } = body;

    if (!assistantId || !userMessage) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: assistantId or userMessage",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Use provided sessionId or generate a new one
    const sessionId = providedSessionId || uuidv4();

    // Call OpenAI service to interact with the assistant
    const answer = await openAIService.chats.chatWithThread(
      assistantId,
      sessionId,
      userMessage,
    );

    // Return the assistant's response and sessionId
    return new Response(
      JSON.stringify({
        answer,
        sessionId, // Return sessionId so the client can reuse it
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
