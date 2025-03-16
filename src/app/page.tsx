"use client";

import LandingPageItem from "@/lib/components/landingpage/molecules/LandingPageItem";
import LandingNavBar from "@/lib/components/landingpage/organisms/LandingNavBar";
import { EyeCatcher } from "@/lib/components/shared/organisms/EyeCatcher";
import Footer from "@/lib/components/shared/organisms/Footer";
import { HowTo } from "@/lib/components/shared/organisms/HowTo";
import { Pricing } from "@/lib/components/shared/organisms/Pricing";
import { SnippetExample } from "@/lib/components/shared/organisms/SnippetExample";
import TestimonialCarousel from "@/lib/components/shared/organisms/Testimonies";
import TutorialVideo from "@/lib/components/shared/organisms/TutorialVideo";
import { baseUrl } from "@/lib/utils/base-url";
import Script from "next/script";

export default function LandingPage() {
  return (
    <div>
      <LandingNavBar />

      <div className="text-xl mt-8">
        <LandingPageItem name="eyecatcher">
          <EyeCatcher />
        </LandingPageItem>

        <LandingPageItem name="tutorial">
          <TutorialVideo />
        </LandingPageItem>

        <LandingPageItem name="pricing" headline="Preise">
          <Pricing />
        </LandingPageItem>

        <LandingPageItem name="howto" headline="Wie geht KnexAI?">
          <HowTo />
        </LandingPageItem>

        <LandingPageItem name="testimonials" headline="Was unsere Kunden sagen">
          <TestimonialCarousel />
        </LandingPageItem>

        <LandingPageItem
          name="code-example"
          headline="Integriere deinen ChatBot mit nur einer Zeile Code!"
        >
          <SnippetExample />
        </LandingPageItem>

        <Script
          src={`${baseUrl}/api/chatbot/integrate?chatbotId=${process.env.NEXT_PUBLIC_LANDINGPAGE_CHATBOT_ID}`}
          api-url={baseUrl}
        ></Script>

        <Spacing />
      </div>
      <Footer />
    </div>
  );
}

const Spacing: React.FC<{ amount?: number | string }> = ({ amount = 100 }) => {
  return (
    <div
      style={{ marginTop: typeof amount === "number" ? `${amount}px` : amount }}
    />
  );
};
