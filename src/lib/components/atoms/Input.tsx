// src/lib/components/atoms/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => (
  <div className="flex flex-col space-y-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      className={`border border-gray-300 rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
    {error && <span className="text-sm text-red-500">{error}</span>}
  </div>
);

// Textarea variant
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = "",
  ...props
}) => (
  <div className="flex flex-col space-y-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <textarea
      className={`border border-gray-300 rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
    {error && <span className="text-sm text-red-500">{error}</span>}
  </div>
);
