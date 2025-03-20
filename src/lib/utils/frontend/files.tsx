import {
  NEXT_PUBLIC_SOURCES_FILES_SIZE_MB,
  NEXT_PUBLIC_SOURCES_FILES_TYPES,
} from "@/lib/utils/environment";
import {
  File,
  FileQuestion,
  FileText,
  FileUser,
  Globe,
  Presentation,
  Sheet,
} from "lucide-react";
import { JSX } from "react";

const FILE_TYPES =
  NEXT_PUBLIC_SOURCES_FILES_TYPES.split(",").map((t) =>
    t.trim().toLowerCase(),
  ) || [];

const MAX_FILE_SIZE_MB = Number(NEXT_PUBLIC_SOURCES_FILES_SIZE_MB) || 5;

export class FileExtensionException extends Error {
  constructor(file: File, extension?: string) {
    super(
      `File ${file.name} has the wrong extension: ${extension}. Allowed are: ${FILE_TYPES.join(", ")}`,
    );
  }
}

export class FileSizeException extends Error {
  constructor(file: File, fileSizeMB: number) {
    super(
      `File ${file.name} exceeds the allowed file size (MB) of ${MAX_FILE_SIZE_MB} mb: ${fileSizeMB} mb`,
    );
  }
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function getFileIconType(source: string, filename?: string) {
  const extension = filename ? getFileExtension(filename) : "";

  switch (source) {
    case "FilesService": {
      const iconMap: { [key: string]: JSX.Element } = {
        pdf: <FileUser className="w-full h-full" />,
        docx: <FileText className="w-full h-full" />,
        txt: <FileText className="w-full h-full" />,
        pptx: <Presentation className="w-full h-full" />,
        xlsx: <Sheet className="w-full h-full" />,
        csv: <Sheet className="w-full h-full" />,
      };

      return (
        iconMap[extension] || <File className="w-full h-full text-gray-400" />
      );
    }

    case "WebsiteSourceCrawler":
      return <Globe className="w-full h-full" />;

    default:
      return <FileQuestion className="w-full h-full text-gray-400" />;
  }
}

export function checkFileUploadable(file: File) {
  const fileExtension = getFileExtension(file.name);
  const fileSizeMB = file.size / (1024 * 1024);

  if (!fileExtension || !FILE_TYPES.includes(fileExtension)) {
    throw new FileExtensionException(file, fileExtension);
  }

  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    throw new FileSizeException(file, fileSizeMB);
  }
}

export function getAcceptableFileTypes(): string {
  return FILE_TYPES.map((ext) => `.${ext}`).join(", ");
}

export { FILE_TYPES, MAX_FILE_SIZE_MB };
