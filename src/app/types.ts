import { ReactElement, JSXElementConstructor } from "react";

export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  content: ReactElement<unknown, string | JSXElementConstructor<object>>;
}

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;