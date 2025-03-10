import {
  DocumentIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { JSX } from "react";

const FILE_TYPES =
  process.env.NEXT_PUBLIC_SOURCES_FILES_TYPES?.split(",").map((t) =>
    t.trim().toLowerCase(),
  ) || [];

const MAX_FILE_SIZE_MB =
  Number(process.env.NEXT_PUBLIC_SOURCES_FILES_SIZE_MB) || 5;

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
        pdf: <DocumentIcon className="w-full h-full" />,
        docx: <DocumentTextIcon className="w-full h-full" />,
        txt: <DocumentTextIcon className="w-full h-full" />,
        pptx: <PresentationChartLineIcon className="w-full h-full" />,
        xlsx: <TableCellsIcon className="w-full h-full" />,
        csv: <TableCellsIcon className="w-full h-full" />,
      };

      return (
        iconMap[extension] || (
          <DocumentIcon className="w-full h-full text-gray-400" />
        )
      );
    }

    case "WebsiteSourceCrawler":
      return <GlobeAltIcon className="w-full h-full" />;

    default:
      return <QuestionMarkCircleIcon className="w-full h-full text-gray-400" />;
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
