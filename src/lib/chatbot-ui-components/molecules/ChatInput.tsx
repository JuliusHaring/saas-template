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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission (if inside a form)
      handleSend();
    }
  };

  return (
    <div className="flex p-4 border-t border-gray-300">
      <Input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown} // Handle "Enter" key
        placeholder="Nachricht..."
        className="flex-1"
      />
      <Button onClick={handleSend} className="ml-2">
        Senden
      </Button>
    </div>
  );
};
