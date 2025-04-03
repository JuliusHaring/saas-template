"use client";

import LandingPageItem from "@/lib/components/landingpage/molecules/LandingPageItem";
import Footer from "@/lib/components/shared/organisms/Footer";
import DefaultNavBar from "@/lib/components/shared/organisms/DefaultNavBar";

export default function LandingPage() {
  return (
    <div>
      <DefaultNavBar />
      <div className="text-xl mt-8">
        <LandingPageItem
          name="start"
          headline="Ausfüllen."
        >
          Erstes Item
        </LandingPageItem>

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
