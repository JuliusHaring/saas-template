import { IconType } from "@/app/types";
import React from "react";

interface SocialIconProps {
  href: string;
  icon: IconType;
  label: string;
}

export default function SocialIcon({
  href,
  icon: Icon,
  label,
}: SocialIconProps) {
  const isExternal = !href.startsWith("mailto:");

  return (
    <a
      href={href}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      aria-label={label}
      className="hover:text-blue-600 transition-colors"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
