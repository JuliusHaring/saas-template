"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { injectSpeedInsights } from "@vercel/speed-insights";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  injectSpeedInsights();

  useEffect(() => {
    const initialize = async () => {
      const res = await fetch("/api/stripe/initialize", { method: "POST" });
      if (res.ok) setInitialized(true);
    };

    if (!process.env.MODE) initialize();
  }, []); // 🔥 Missing dependency `[]` added to run only once

  if (!initialized) {
    return <></>; // Keeps the UI hidden until Stripe is initialized
  }

  return (
    <>
      <Analytics />
      {children}
    </>
  );
}
