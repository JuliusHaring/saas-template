import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const ragService = await PostGresRAGService.getInstance();

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = await getUserId();
    const chatBotId = (await params).chatBotId;

    return ragService.getIngestionStatus(chatBotId, userId);
  },
);
