import { ChatBotIdType } from "@/lib/db/types";
import { FilesService } from "@/lib/services/api-services/rag/files-service";
import { DocumentIdType } from "@/lib/services/api-services/rag/types";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const filesService = FilesService.Instance;

export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    {
      params,
    }: {
      params: Promise<{ chatBotId: ChatBotIdType; documentId: DocumentIdType }>;
    },
  ) => {
    const userId = await getUserId();
    const chatBotId = (await params).chatBotId;
    const documentId = (await params).documentId;

    return filesService.deleteSingleFile(chatBotId, userId, documentId);
  },
);
