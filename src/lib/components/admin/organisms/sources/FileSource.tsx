import Button from "@/lib/components/admin/molecules/Button";
import Card from "@/lib/components/admin/organisms/Card";
import { DocumentType } from "@/lib/services/api-services/rag/types";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import { useEffect, useState } from "react";

const feRagService = FERAGService.Instance;

export const FileSource: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  const [ragFiles, setRagFiles] = useState<DocumentType[]>([]);

  useEffect(() => {
    const fetchRagFiles = async () => {
      const files = await feRagService.getSingleFiles(chatBotId);
      setRagFiles(files);
    };

    fetchRagFiles();
  }, [chatBotId]); // Added dependency to ensure proper updates

  return (
    <Card className="mt-4" header={Header} footer={Footer}>
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

const Header = "Datei Upload";
const Footer = <>Senden</>;
