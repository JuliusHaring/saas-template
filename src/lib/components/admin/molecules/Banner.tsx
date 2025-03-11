import React from "react";

interface BannerProps {
  variant?: "danger" | "success" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  danger: "bg-red-100 text-red-800 border-red-400",
  success: "bg-green-100 text-green-800 border-green-400",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
  info: "bg-blue-100 text-blue-800 border-blue-400",
};

const Banner: React.FC<BannerProps> = ({
  variant = "info",
  children,
  className,
}) => {
  return (
    <div
      className={`border-1 p-4 ${variantClasses[variant]} ${!!className && className}`}
    >
      {children}
    </div>
  );
};

export default Banner;
