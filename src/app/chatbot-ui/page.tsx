"use client";
import { useEffect, useState } from "react";

export default function ChatbotUI() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [userInput, setUserInput] = useState("");
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get assistantId from the URL query string
    const params = new URLSearchParams(window.location.search);
    const id = params.get("assistantId");
    if (id) {
      setAssistantId(id);

      // Retrieve the session ID from localStorage if it exists
      const storedSessionId = localStorage.getItem(`session_${id}`);
      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        console.log("No session ID found; a new session will be created.");
      }
    } else {
      console.error("Missing assistantId in the query string");
    }
  }, []);

  useEffect(() => {
    const loadStyles = async () => {
      if (!assistantId) return;

      try {
        const response = await fetch(
          `/api/chatbot/styles?assistantId=${assistantId}`,
        );
        if (response.ok) {
          const { css } = await response.json();
          const styleTag = document.createElement("style");
          styleTag.innerHTML = css;
          document.head.appendChild(styleTag);
        }
      } catch (error) {
        console.error("Failed to load styles:", error);
      }
    };

    loadStyles();
  }, [assistantId]);

  const sendMessage = async () => {
    if (!userInput || !assistantId) return;

    const userMessage = userInput;
    setMessages((prev) => [...prev, { role: "User", text: userMessage }]);
    setUserInput("");

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, userMessage, sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the assistant");
      }

      const { answer, sessionId: newSessionId } = await response.json();

      // Update session ID if a new one is provided
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        localStorage.setItem(`session_${assistantId}`, newSessionId);
      }

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
