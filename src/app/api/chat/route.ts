import { OpenAIChatService } from "@/lib/services/openai-service";
import { Quota, QuotaService } from "@/lib/services/quotas-service";
import { BadRequest, handleHttpError } from "@/lib/utils/routes/http-errors";
import { v4 as uuidv4 } from "uuid";

const openAIChatService = OpenAIChatService.Instance;
const quotaService = QuotaService.Instance;

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

    await quotaService.updateAssistantUsage(
      assistantId,
      Quota.MAX_CHAT_MESSAGES,
      1,
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
