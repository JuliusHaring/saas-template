"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SpeedInsights />
      <Analytics />
      {children}
    </>
  );
}
