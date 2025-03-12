import { SourcesService } from "@/lib/services/api-services/sources-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling, NotFound } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const sourcesService = SourcesService.Instance;

export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = await getUserId(request);
    const chatBotId = (await params).chatBotId;

    if (!chatBotId) {
      throw NotFound(`ChatBot ${chatBotId} not found`);
    }

    const chatbotDelete = await sourcesService.deleteWebsiteSource(
      userId,
      chatBotId,
    );

    return chatbotDelete;
  },
);
