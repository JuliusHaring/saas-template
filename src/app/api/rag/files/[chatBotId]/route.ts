import {
  Quota,
  QuotaService,
} from "@/lib/services/api-services/quotas-service";
import { FilesService } from "@/lib/services/api-services/rag/files";
import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";
import { RAGFile } from "@/lib/services/api-services/rag/types";
import {
  NotFound,
  QuotaReached,
  withErrorHandling,
} from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const ragService: IRAGService = PostGresRAGService.Instance;
const quotaService = await QuotaService.getInstance();
const filesService = FilesService.Instance;

export const POST = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = "user_2sJ0FW5ihrjBvSXpMZkw5f5uzyG";
    const chatBotId = (await params).chatBotId;

    const formData = await request.formData();
    const rawFiles = formData.getAll("files") as File[];

    if (!rawFiles.length) {
      throw NotFound("No files attached");
    }

    const quotaRemainder = await quotaService.getUserQuotaRemainder(
      userId,
      Quota.MAX_FILES,
    );

    if (rawFiles.length > quotaRemainder) {
      throw QuotaReached(
        `Tried to upload ${rawFiles.length} files, only ${quotaRemainder} are left in the quota`,
      );
    }

    const ragFiles: RAGFile[] =
      await filesService.convertFilesToRagFiles(rawFiles);

    const countObj = await ragService.insertFiles(chatBotId, ragFiles);

    return countObj;
  },
);
