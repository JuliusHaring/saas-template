"use client";

import LandingNavBar from "@/lib/components/landingpage/organisms/LandingNavBar";
import { EyeCatcher } from "@/lib/components/shared/organisms/EyeCatcher";
import { HowTo } from "@/lib/components/shared/organisms/HowTo";
import { SnippetExample } from "@/lib/components/shared/organisms/SnippetExample";
import { Element } from "react-scroll";

export default function LandingPage() {
  return (
    <div>
      <LandingNavBar />

      <div className="text-xl lg:px-40 md:px-10 px-4 mt-8">
        <Element name="eyecatcher">
          <EyeCatcher />
        </Element>
        <Spacing />

        <Element name="howto">
          <HowTo />
        </Element>

        <Element name="code-example">
          <SnippetExample />
        </Element>
        <Spacing amount={40} />
      </div>
    </div>
  );
}

const Spacing: React.FC<{ amount?: number | string }> = ({ amount = 20 }) => {
  return (
    <div
      style={{ marginTop: typeof amount === "number" ? `${amount}px` : amount }}
    />
  );
};
