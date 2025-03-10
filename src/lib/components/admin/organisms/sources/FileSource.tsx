import Button from "@/lib/components/admin/molecules/Button";
import Card from "@/lib/components/admin/organisms/Card";
import { FileIdType, FileType } from "@/lib/services/api-services/rag/types";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import {
  checkFileUploadable,
  getAcceptableFileTypes,
  getFileIconType,
} from "@/lib/utils/frontend/files";
import { useEffect, useState, useRef } from "react";
import {
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  FolderMinusIcon,
} from "@heroicons/react/24/outline";

const feRagService = FERAGService.Instance;

export const FileSource: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  const [ragFiles, setRagFiles] = useState<FileType[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRagFiles = async () => {
    const files = await feRagService.getFiles(chatBotId);
    const sortedFiles = files.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setRagFiles(sortedFiles);
  };

  useEffect(() => {
    fetchRagFiles();
  }, [chatBotId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    try {
      const newFiles = Array.from(event.target.files).map((file) => {
        checkFileUploadable(file);
        return file;
      });

      setSelectedFiles(newFiles);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      await feRagService.uploadFiles(chatBotId, selectedFiles);
      setSelectedFiles([]);
      fetchRagFiles();
    } catch (error) {
      console.error("File upload failed:", error);
      setError("Fehler beim Hochladen der Datei.");
    }
    setIsUploading(false);
  };

  const handleDelete = async (fileId: FileIdType) => {
    try {
      await feRagService.deleteFile(chatBotId, fileId);
      fetchRagFiles();
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
    }
  };

  const handleDeleteInsetionSource = async (fileId: FileIdType) => {
    try {
      await feRagService.deleteFilesWithSameInsertionSource(chatBotId, fileId);
      fetchRagFiles();
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
    }
  };

  return (
    <Card
      header="Dateien"
      footer={UploadFooter(
        fileInputRef,
        handleFileChange,
        handleUpload,
        selectedFiles,
        isUploading,
      )}
    >
      {error && <p className="text-red-500 p-2">{error}</p>}

      {/* Responsive grid container */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {ragFiles.length > 0 ? (
          ragFiles.map((file) => (
            <div
              key={file.id}
              className="relative flex flex-col items-center p-3"
            >
              {/* Delete button in top-right corner */}
              <div className="absolute top-1 right-1">
                <Button
                  className="h-6 w-6 px-1! py-1!"
                  variant="danger"
                  onClick={() => handleDelete(file.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
                &nbsp;
                <Button
                  className="h-6 w-6 px-1! py-1!"
                  variant="danger"
                  onClick={() => handleDeleteInsetionSource(file.id)}
                >
                  <FolderMinusIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* File Icon */}
              <div className="w-12 h-12 text-gray-500">
                {getFileIconType(file.insertionSource, file.name)}
              </div>

              {/* File Name */}
              <p className="text-sm text-center truncate w-full mt-2">
                {file.name}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Keine Dateien vorhanden
          </p>
        )}
      </div>
    </Card>
  );
};

const UploadFooter = (
  fileInputRef: React.RefObject<HTMLInputElement | null>,
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleUpload: () => void,
  selectedFiles: File[],
  isUploading: boolean,
) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept={getAcceptableFileTypes()} // Enforces file types from utils
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
        isDisabled={isUploading}
      >
        <PlusIcon className="w-5 h-5" />
        Dateien auswählen
      </Button>
      <span className="text-gray-700">
        {selectedFiles.length > 0
          ? selectedFiles.map((file) => file.name).join(", ")
          : "Keine Dateien ausgewählt"}
      </span>
      <Button
        onClick={handleUpload}
        isDisabled={selectedFiles.length === 0 || isUploading}
        className="flex items-center gap-2"
      >
        <ArrowPathIcon className="w-5 h-5" />
        Hochladen
      </Button>
    </div>
  );
};
