import Headline from "@/lib/components/shared/molecules/Headline";
import { Element } from "react-scroll";

interface LandingPageItemProps {
  name: string;
  headline?: React.ReactNode;
  children: React.ReactNode;
  spaceTop?: number | string;
}

const LandingPageItem: React.FC<LandingPageItemProps> = ({
  name,
  children,
  headline,
  spaceTop,
}) => {
  return (
    <Element name={name} className={`mt-${spaceTop || 20}`}>
      {headline && (
        <Headline level={2} className="text-blue-500">
          {headline}
        </Headline>
      )}
      {children}
    </Element>
  );
};

export default LandingPageItem;
