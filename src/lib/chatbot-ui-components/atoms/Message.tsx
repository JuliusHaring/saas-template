import React from "react";
import { MessageType } from "../types";

export const Message: React.FC<MessageType> = ({ role, text }) => (
  <div
    className={`p-2 rounded-md ${role === "Nutzer" ? "bg-blue-100" : "bg-gray-100"}`}
  >
    <strong>{role}:</strong> {text}
  </div>
);
