import Button from "@/lib/components/molecules/Button";
import { Input } from "@/lib/components/molecules/Input";
import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (!userInput.trim()) return;
    onSend(userInput);
    setUserInput("");
  };

  return (
    <div className="flex p-4 border-t border-gray-300">
      <Input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Nachricht..."
        className="flex-1"
      />
      <Button onClick={handleSend} className="ml-2">
        Senden
      </Button>
    </div>
  );
};
