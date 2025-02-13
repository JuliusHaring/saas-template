"use client";

import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

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

  return <>{children}</>;
}
