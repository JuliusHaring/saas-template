export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export interface SidenavContent {
  title: string;
  href: string;
  icon?: IconType;
}

export const NAVBAR_CONTENT: SidenavContent[] = [
  // {
  //   title: "ChatBots",
  //   href: "/admin/chatbots",
  //   icon: CpuChipIcon,
  // },
];
