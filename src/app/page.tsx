"use client";

import LandingPageItem from "@/lib/components/landingpage/molecules/LandingPageItem";
import LandingNavBar from "@/lib/components/landingpage/organisms/LandingNavBar";
import { EyeCatcher } from "@/lib/components/shared/organisms/EyeCatcher";
import { HowTo } from "@/lib/components/shared/organisms/HowTo";
import { Pricing } from "@/lib/components/shared/organisms/Pricing";
import { SnippetExample } from "@/lib/components/shared/organisms/SnippetExample";
import TestimonialCarousel from "@/lib/components/shared/organisms/Testimonies";
import TutorialVideo from "@/lib/components/shared/organisms/TutorialVideo";

export default function LandingPage() {
  return (
    <div>
      <LandingNavBar />

      <div className="text-xl lg:px-40 md:px-10 px-4 mt-8">
        <LandingPageItem name="eyecatcher">
          <EyeCatcher />
        </LandingPageItem>

        <LandingPageItem name="tutorial" spaceTop={10}>
          <TutorialVideo />
        </LandingPageItem>

        <LandingPageItem name="pricing" headline="Preise">
          <Pricing />
        </LandingPageItem>

        <LandingPageItem name="howto" headline="Wie geht KnexAI?" spaceTop="10">
          <HowTo />
        </LandingPageItem>

        <LandingPageItem name="testimonies" headline="Was unsere Kunden sagen">
          <TestimonialCarousel />
        </LandingPageItem>

        <LandingPageItem
          name="code-example"
          headline="Integriere deinen ChatBot mit nur einer Zeile Code!"
        >
          <SnippetExample />
        </LandingPageItem>

        <Spacing />
      </div>
    </div>
  );
}

const Spacing: React.FC<{ amount?: number | string }> = ({ amount = 200 }) => {
  return (
    <div
      style={{ marginTop: typeof amount === "number" ? `${amount}px` : amount }}
    />
  );
};
