export type MessageRole = "Nutzer" | "Antwort";

export type MessageType = {
  role: MessageRole;
  html: string;
};
