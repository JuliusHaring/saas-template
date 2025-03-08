import Button from "@/lib/components/admin/molecules/Button";
import Card from "@/lib/components/admin/organisms/Card";
import { DocumentType } from "@/lib/services/api-services/rag/types";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import { useEffect, useState, useRef } from "react";

const feRagService = FERAGService.Instance;

export const FileSource: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  const [ragFiles, setRagFiles] = useState<DocumentType[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRagFiles = async () => {
    const files = await feRagService.getSingleFiles(chatBotId);
    setRagFiles(files);
  };

  useEffect(() => {
    fetchRagFiles();
  }, [chatBotId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await feRagService.uploadSingleFile(chatBotId, selectedFile);
      setSelectedFile(null);
      fetchRagFiles();
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <Card className="mt-4" header="Datei Upload" footer={Footer}>
      {/* Custom file input */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          Datei auswählen
        </Button>
        <span className="text-gray-700">
          {selectedFile ? selectedFile.name : "Keine Datei ausgewählt"}
        </span>
        <Button onClick={handleUpload} isDisabled={!selectedFile}>
          Hochladen
        </Button>
      </div>

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
              <tr key={file.name} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{file.name}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(file.createdAt).toLocaleString("de-DE")}
                </td>
                <td className="border border-gray-300 p-2">
                  <Button variant="danger">Löschen</Button>
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

const Footer = <>Senden</>;
