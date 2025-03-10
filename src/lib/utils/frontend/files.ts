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

export function checkFileUploadable(file: File) {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
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
