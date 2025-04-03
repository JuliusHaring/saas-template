import React from "react";
import { FieldErrors } from "react-hook-form";

interface InputErrorProps {
  errors: FieldErrors;
  name: string;
}

const InputError: React.FC<InputErrorProps> = ({ errors, name }) => {
  const errorMessage = errors[name]?.message as string | undefined;

  if (!errorMessage) return null;

  return <span className="text-sm text-red-500">{errorMessage}</span>;
};

export default InputError;
