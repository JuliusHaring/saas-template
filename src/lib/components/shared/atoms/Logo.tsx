import Headline from "@/lib/components/shared/molecules/Headline";
import Typical from "react-typical";

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Headline
      level={1}
      className={`hover:text-blue-600 ${!!className && className}`}
    >
      <Typical steps={["", 100, "KnexAI", 500]} />
    </Headline>
  );
};
