import { IconType } from "@/app/admin/constants";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

interface NavbarItemProps extends LinkProps {
  icon?: IconType;
  onClick?: () => void; // Optional onClick handler
}

export default function NavbarItem({
  children,
  icon: Icon,
  onClick,
  ...linkProps
}: React.PropsWithChildren<NavbarItemProps>) {
  const content = (
    <div
      className="flex items-center gap-2 p-3 hover:bg-blue-400 hover:font-semibold hover:shadow hover:shadow-blue-600 active:bg-blue-500 -sm cursor-pointer"
      onClick={onClick} // Trigger onClick when clicked
    >
      {Icon && <Icon className="h-6 w-6" />}
      {children}
    </div>
  );

  return onClick ? content : <Link {...linkProps}>{content}</Link>;
}
