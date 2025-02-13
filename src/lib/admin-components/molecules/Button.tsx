import Link from "next/link";
import { MouseEventHandler } from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  isDisabled = false,
  type = "button",
  onClick,
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
}) {
  const baseClasses =
    "inline-flex inset-shadow-black justify-center font-semibold focus:outline-none hover:items-center hover:inset-shadow-sm transition-all";

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-2 focus:ring-blue-400",
    secondary:
      "bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 focus:ring-2 focus:ring-gray-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-2 focus:ring-red-400",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        isDisabled ? disabledClasses : ""
      } ${className}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {typeof href === "string" ? (
        <Link href={href}>{children}</Link>
      ) : (
        children
      )}
    </button>
  );
}
