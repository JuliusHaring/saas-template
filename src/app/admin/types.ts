export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export interface SidenavContent {
  title: string;
  href: string;
  icon?: IconType;
}
