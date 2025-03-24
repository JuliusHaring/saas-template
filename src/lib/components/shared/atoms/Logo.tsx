import Headline from "@/lib/components/shared/molecules/Headline";
import Link from "next/link";
import Typical from "react-typical";

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link href={"/"}>
      <Headline
        level={1}
        className={`hover:text-blue-600 ${!!className && className} cursor-pointer`}
      >
        <Typical steps={["", 100, "KnexAI", 500]} />
      </Headline>
    </Link>
  );
};
