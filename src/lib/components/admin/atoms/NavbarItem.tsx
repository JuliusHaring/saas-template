import { IconType } from "@/app/admin/constants";
import Link, { LinkProps } from "next/link";
import React from "react";

interface NavbarItemProps extends Partial<LinkProps> {
  icon?: IconType;
  onClick?: () => void;
}

export default function NavbarItem({
  children,
  icon: Icon,
  onClick,
  href,
  ...linkProps
}: React.PropsWithChildren<NavbarItemProps>) {
  const content = (
    <div
      className="cursor-pointer text-gray-700 hover:text-black transition-colors duration-200"
      onClick={onClick}
    >
      {Icon && <Icon className="h-5 w-5 inline-block mr-2" />}
      {children}
    </div>
  );

  return href ? (
    <Link href={href} {...linkProps}>
      {content}
    </Link>
  ) : (
    content
  );
}
