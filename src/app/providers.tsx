"use client";

import { Analytics } from "@vercel/analytics/react";
import { injectSpeedInsights } from "@vercel/speed-insights";

export default function Providers({ children }: { children: React.ReactNode }) {
  injectSpeedInsights();

  return (
    <>
      <Analytics />
      {children}
    </>
  );
}
