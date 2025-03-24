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
    <Element name={name} className={`mt-${spaceTop || 10}`}>
      {headline && (
        <div className="text-center mb-8">
          <Headline level={2} className="text-blue-600">
            {headline}
          </Headline>
        </div>
      )}
      {children}
    </Element>
  );
};

export default LandingPageItem;
