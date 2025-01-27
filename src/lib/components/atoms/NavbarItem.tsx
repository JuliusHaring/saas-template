import { IconType } from "@/app/admin/constants";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

export default function NavbarItem({
  children,
  icon: Icon,
  ...linkProps
}: React.PropsWithChildren<LinkProps> & {
  icon?: IconType;
}) {
  return (
    <Link {...linkProps}>
      <div className="flex items-center gap-2 p-3 hover:bg-blue-400 hover:font-semibold active:bg-blue-500">
        {Icon && <Icon className="h-6 w-6" />}
        {children}
      </div>
    </Link>
  );
}
