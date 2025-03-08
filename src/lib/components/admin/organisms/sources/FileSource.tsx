import Button from "@/lib/components/admin/molecules/Button";
import Card from "@/lib/components/admin/organisms/Card";
import {
  DocumentIdType,
  DocumentType,
} from "@/lib/services/api-services/rag/types";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import { useEffect, useState, useRef } from "react";

const feRagService = FERAGService.Instance;

export const FileSource: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  const [ragFiles, setRagFiles] = useState<DocumentType[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRagFiles = async () => {
    const files = await feRagService.getSingleFiles(chatBotId);

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
    if (event.target.files?.length) {
      setSelectedFiles(Array.from(event.target.files)); // Store all selected files
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await feRagService.uploadSingleFiles(chatBotId, selectedFiles);
      setSelectedFiles([]); // Clear selected files after upload
      fetchRagFiles();
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleDelete = async (documentId: DocumentIdType) => {
    try {
      await feRagService.deleteSingleFile(chatBotId, documentId);
      fetchRagFiles();
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
    }
  };

  return (
    <Card
      className="mt-4"
      header="Datei Upload"
      footer={UploadFooter(
        fileInputRef,
        handleFileChange,
        handleUpload,
        selectedFiles,
      )}
    >
      {/* File list */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 text-left">Dateiname</th>
            <th className="border border-gray-300 p-2 text-left">
              Erstellt am
            </th>
            <th className="border border-gray-300 p-2 text-left">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {ragFiles.length > 0 ? (
            ragFiles.map((file) => (
              <tr key={file.id} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{file.name}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(file.createdAt).toLocaleString("de-DE")}
                </td>
                <td className="border border-gray-300 p-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(file.id)}
                  >
                    Löschen
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">
                Keine Dateien vorhanden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
};

const UploadFooter = (
  fileInputRef: React.RefObject<HTMLInputElement | null>,
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleUpload: () => void,
  selectedFiles: File[],
) => (
  <div className="flex items-center gap-4">
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      multiple // Allow multiple files
      className="hidden"
    />
    <Button onClick={() => fileInputRef.current?.click()}>
      Dateien auswählen
    </Button>
    <span className="text-gray-700">
      {selectedFiles.length > 0
        ? selectedFiles.map((file) => file.name).join(", ")
        : "Keine Dateien ausgewählt"}
    </span>
    <Button onClick={handleUpload} isDisabled={selectedFiles.length === 0}>
      Hochladen
    </Button>
  </div>
);
