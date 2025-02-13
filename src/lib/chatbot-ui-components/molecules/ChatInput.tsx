import Button from "@/lib/components/molecules/Button";
import { Input } from "@/lib/components/molecules/Input";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isWaiting: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isWaiting }) => {
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (!userInput.trim() || isWaiting) return;
    onSend(userInput);
    setUserInput("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full border-t border-gray-300 p-4 flex bg-white">
      <Input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isWaiting ? "Warten auf Antwort..." : "Nachricht..."}
        disabled={isWaiting}
        className="flex-1 min-w-0 w-full"
      />
      <Button
        onClick={handleSend}
        className="ml-2 w-auto shrink-0"
        isDisabled={isWaiting}
      >
        Senden
      </Button>
    </div>
  );
};
