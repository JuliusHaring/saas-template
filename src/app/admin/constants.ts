import { AtSymbolIcon, Battery100Icon } from "@heroicons/react/24/solid";

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export interface SidenavContent {
  title: string;
  href: string;
  icon?: IconType;
}

export const NAVBAR_CONTENT: SidenavContent[] = [
  {
    title: "ChatBots",
    href: "/admin/",
    icon: AtSymbolIcon,
  },
  {
    title: "Other Stuff",
    href: "/admin/",
    icon: Battery100Icon,
  },
];
