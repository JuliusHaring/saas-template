import { ChatBotIdType } from "@/lib/db/types";
import { FilesService } from "@/lib/services/api-services/rag/files-service";
import { FileIdType } from "@/lib/services/api-services/rag/types";
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
      params: Promise<{ chatBotId: ChatBotIdType; fileId: FileIdType }>;
    },
  ) => {
    const userId = await getUserId(request);
    const chatBotId = (await params).chatBotId;
    const fileId = (await params).fileId;

    return filesService.deleteFile(chatBotId, userId, fileId);
  },
);
