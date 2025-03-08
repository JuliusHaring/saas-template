import { RAGFile } from "@/lib/services/api-services/rag/types";

export class FilesService {
  private static _instance: FilesService;

  private FILE_TYPES =
    process.env.NEXT_PUBLIC_SOURCES_FILES_TYPES?.split(",").map((t) =>
      t.trim(),
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

  public async convertFilesToRagFiles(files: File[]): Promise<RAGFile[]> {
    return Promise.all(
      files.map(async (file) => {
        this._checkFileType(file);

        const arrayBuffer = await file.arrayBuffer();
        const textContent = new TextDecoder("utf-8").decode(arrayBuffer);

        const now = new Date();
        const timestamp = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}_${String(now.getDate()).padStart(2, "0")}__${String(now.getHours()).padStart(2, "0")}_${String(now.getMinutes()).padStart(2, "0")}`;
        const fileNameWithDate = `${timestamp}_${file.name}`;

        return new RAGFile(fileNameWithDate, textContent);
      }),
    );
  }
}
