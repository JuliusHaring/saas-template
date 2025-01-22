"use client";

import { useEffect, useState } from "react";

export default function ChatbotUI() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [userInput, setUserInput] = useState("");
  const [assistantId, setAssistantId] = useState<string | null>(null);

  useEffect(() => {
    // Extract assistantId from the query string
    const params = new URLSearchParams(window.location.search);
    const id = params.get("assistantId");
    if (id) setAssistantId(id);
    else console.error("Missing assistantId in the query string");
  }, []);

  const sendMessage = async () => {
    if (!userInput || !assistantId) return;

    const userMessage = userInput;
    setMessages((prev) => [...prev, { role: "User", text: userMessage }]);
    setUserInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the assistant");
      }

      const { answer } = await response.json();
      setMessages((prev) => [...prev, { role: "Assistant", text: answer }]);
    } catch (error) {
      console.error("Error communicating with the assistant:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        id="messages"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <strong>{message.role}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div
        id="input-area"
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
