"use client";

import LandingPageItem from "@/lib/components/landingpage/molecules/LandingPageItem";
import LandingNavBar from "@/lib/components/landingpage/organisms/LandingNavBar";
import Footer from "@/lib/components/shared/organisms/Footer";
import { Pricing } from "@/lib/components/landingpage/organisms/Pricing";
import { SnippetExample } from "@/lib/components/landingpage/organisms/SnippetExample";
import TestimonialCarousel from "@/lib/components/landingpage/organisms/Testimonies";
import TutorialVideo from "@/lib/components/landingpage/organisms/TutorialVideo";
import {
  NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_LANDINGPAGE_CHATBOT_ID,
} from "@/lib/utils/environment";
import Script from "next/script";
import { Explanation } from "@/lib/components/landingpage/organisms/Explanation";

export default function LandingPage() {
  return (
    <div>
      <LandingNavBar />

      <div className="text-xl mt-8">
        <LandingPageItem
          name="explanation"
          headline="Dein Chatbot. Dein Wissen. Sofort verfügbar."
          spaceTop={10}
        >
          <Explanation />
        </LandingPageItem>

        <LandingPageItem name="tutorial">
          <TutorialVideo />
        </LandingPageItem>

        <LandingPageItem name="pricing" headline="Preise">
          <Pricing />
        </LandingPageItem>

        {/* <LandingPageItem name="howto" headline="Wie geht KnexAI?">
          <HowTo />
        </LandingPageItem> */}

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
          src={`${NEXT_PUBLIC_BASE_URL}/api/chatbot/integrate?chatbotId=${NEXT_PUBLIC_LANDINGPAGE_CHATBOT_ID}`}
          api-url={NEXT_PUBLIC_BASE_URL}
          show-on-pages="/"
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
