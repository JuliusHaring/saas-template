import { deleteFile, getFiles } from "@/lib/db/pg-rag";
import { ChatBotIdType, UserIdType } from "@/lib/db/types";
import { FileIdType, RAGFile } from "@/lib/services/api-services/rag/types";
const { getTextExtractor } = await import("office-text-extractor");

export class FilesService {
  private static _instance: FilesService;

  private FILE_TYPES =
    process.env.NEXT_PUBLIC_SOURCES_FILES_TYPES?.split(",").map((t) =>
      t.trim().toLowerCase(),
    ) || [];

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private _checkFileType(file: File): void {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !this.FILE_TYPES.includes(fileExtension)) {
      throw new Error(`File type not allowed: .${fileExtension || "unknown"}`);
    }
  }

  private async _extractText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    if (["pdf", "docx", "pptx", "xlsx"].includes(fileExtension)) {
      const textExtractor = getTextExtractor();
      return textExtractor.extractText({ input: buffer, type: "buffer" });
    }

    return new TextDecoder("utf-8").decode(buffer);
  }

  public async convertFilesToRagFiles(files: File[]): Promise<RAGFile[]> {
    return Promise.all(
      files.map(async (file) => {
        this._checkFileType(file);

        const textContent = await this._extractText(file);

        return new RAGFile(file.name, textContent);
      }),
    );
  }

  public async getFiles(chatBotId: ChatBotIdType, userId: UserIdType) {
    return getFiles(chatBotId, userId);
  }

  public async deleteFile(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    fileId: FileIdType,
  ) {
    return deleteFile(chatBotId, userId, fileId);
  }
}
