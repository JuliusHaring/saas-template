import { JSX } from "react";

const Headline: React.FC<{
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  block?: boolean;
  children: React.ReactNode;
}> = ({ level = 1, block = false, children }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const styles = {
    1: "text-5xl font-bold",
    2: "text-4xl font-semibold",
    3: "text-3xl font-medium",
    4: "text-2xl font-medium",
    5: "text-xl font-normal",
    6: "text-lg font-light",
  }[level];

  return (
    <Tag className={`${styles} ${block ? "block" : "inline"}`}>{children}</Tag>
  );
};

export default Headline;
