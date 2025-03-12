import {
  ChatBotIdType,
  FilesDeleteFromInsertionSourceType,
} from "@/lib/db/types";
import { FilesService } from "@/lib/services/api-services/rag/files-service";
import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";
import { RAGFile } from "@/lib/services/api-services/rag/types";
import { getUserId } from "@/lib/utils/routes/auth";
import { NotFound, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const ragService: IRAGService = await PostGresRAGService.getInstance();
const filesService = FilesService.Instance;

export const POST = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: ChatBotIdType }> },
  ) => {
    const userId = await getUserId();
    const chatBotId = (await params).chatBotId;

    const formData = await request.formData();
    const rawFiles = formData.getAll("files") as File[];

    if (!rawFiles.length) {
      throw NotFound("No files attached");
    }

    const ragFiles: RAGFile[] =
      await filesService.convertFilesToRagFiles(rawFiles);

    const countObj = await ragService.insertFiles(
      chatBotId,
      userId,
      ragFiles,
      true,
    );

    return countObj;
  },
);

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: ChatBotIdType }> },
  ) => {
    const userId = await getUserId();
    const chatBotId = (await params).chatBotId;

    return filesService.getFiles(chatBotId, userId);
  },
);

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const userId = await getUserId();
  const body: FilesDeleteFromInsertionSourceType = await request.json();

  const file = await filesService.getFile(body.chatBotId, userId, body.fileId);

  return await filesService.deleteFilesFromSource(
    body.chatBotId,
    userId,
    file.insertionSource,
  );
});
