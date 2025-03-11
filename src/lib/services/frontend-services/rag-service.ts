import {
  ChatBotIdType,
  BatchPayload,
  FilesDeleteFromInsertionSourceType,
  IngestionStatusEnum,
} from "@/lib/db/types";
import {
  IngestedFilesResponseType,
  FileIdType,
  FileType,
} from "@/lib/services/api-services/rag/types";
import { fetchJson } from "@/lib/utils/fetch";

export class FERAGService {
  private static _instance: FERAGService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async ingestFiles(chatBotId: ChatBotIdType) {
    return fetchJson<IngestedFilesResponseType>(
      `/api/rag/${chatBotId}/ingest`,
      {
        method: "POST",
      },
    );
  }

  public async getIngestionStatus(
    chatBotId: ChatBotIdType,
  ): Promise<IngestionStatusEnum> {
    return fetchJson<string>(`/api/rag/${chatBotId}/ingest/status`).then(
      (v) => v as IngestionStatusEnum,
    );
  }

  public async getFiles(chatBotId: ChatBotIdType) {
    return fetchJson<FileType[]>(`/api/rag/${chatBotId}/files`);
  }

  public async uploadFiles(chatBotId: ChatBotIdType, files: File[]) {
    const formData = new FormData();

    files.map((file) => {
      formData.append(`files`, file);
    });

    return fetchJson(`/api/rag/${chatBotId}/files`, {
      method: "POST",
      body: formData,
    });
  }

  public async deleteFile(chatBotId: ChatBotIdType, fileId: FileIdType) {
    return fetchJson<FileType>(`/api/rag/${chatBotId}/files/${fileId}`, {
      method: "DELETE",
    });
  }

  public async deleteFilesWithSameInsertionSource(
    chatBotId: ChatBotIdType,
    fileId: FileIdType,
  ) {
    const body: FilesDeleteFromInsertionSourceType = {
      chatBotId,
      fileId,
    };
    return fetchJson<BatchPayload>(`/api/rag/${chatBotId}/files`, {
      method: "DELETE",
      body: JSON.stringify(body),
    });
  }
}
