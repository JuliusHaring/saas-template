"use client";
import { FEStyleService } from "@/lib/frontend-services/style-service";
import { useEffect, useState } from "react";

const feStyleService = FEStyleService.Insance;

export default function ChatbotUI() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [userInput, setUserInput] = useState("");
  const [chatBotId, setChatBotId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get chatBotId from the URL query string
    const params = new URLSearchParams(window.location.search);
    const id = params.get("chatBotId");
    if (id) {
      setChatBotId(id);

      // Retrieve the session ID from localStorage if it exists
      const storedSessionId = localStorage.getItem(`session_${id}`);
      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        console.log("No session ID found; a new session will be created.");
      }
    } else {
      console.error("Missing chatBotId in the query string");
    }
  }, []);

  useEffect(() => {
    const loadStyles = async () => {
      if (!chatBotId) return;

      try {
        const style = await feStyleService.getStyle(chatBotId);
        const styleTag = document.createElement("style");
        styleTag.innerHTML = style.css;
        document.head.appendChild(styleTag);
      } catch (error) {
        console.error("Failed to load styles:", error);
      }
    };

    loadStyles();
  }, [chatBotId]);

  const sendMessage = async () => {
    if (!userInput || !chatBotId) return;

    const userMessage = userInput;
    setMessages((prev) => [...prev, { role: "User", text: userMessage }]);
    setUserInput("");

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatBotId, userMessage, sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the chatbot");
      }

      const { answer, sessionId: newSessionId } = await response.json();

      // Update session ID if a new one is provided
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        localStorage.setItem(`session_${chatBotId}`, newSessionId);
      }

      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (error) {
      console.error("Error communicating with the chatbot:", error);
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
