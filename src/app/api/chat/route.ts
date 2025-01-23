import {
  OpenAIChatService,
  OpenAIService,
} from "@/lib/services/openai-service";
import { v4 as uuidv4 } from "uuid";
import { BadRequest, handleHttpError } from "@/lib/utils/routes/http-errors";

const openAIChatService = OpenAIChatService.Instance;

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the request body
    const body = await request.json();
    const { assistantId, sessionId: providedSessionId, userMessage } = body;

    // Validate input
    if (!assistantId) throw BadRequest("Missing required field: assistantId");
    if (!userMessage) throw BadRequest("Missing required field: userMessage");

    // Use provided sessionId or generate a new one
    const sessionId = providedSessionId || uuidv4();

    // Call OpenAI service to interact with the assistant
    const answer = await openAIChatService.chatWithThread(
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
        status: 200,
      },
    );
  } catch (error) {
    return handleHttpError(error); // Use the error handler for consistent responses
  }
}
