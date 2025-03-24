// @ts-nocheck
"use client";
import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import {
  NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} from "@/lib/utils/environment";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function PricingTablePage({
  params,
}: {
  params: Promise<{ customerEmail: string }>;
}) {
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    const getEmail = async () => {
      const rawEmail = (await params).customerEmail;
      setEmail(decodeURIComponent(rawEmail));
    };
    getEmail();
  }, []);

  if (!email) return <LoadingSpinner />;

  return (
    <div className="w-full">
      <Script
        strategy="lazyOnload"
        src="https://js.stripe.com/v3/pricing-table.js"
      ></Script>

      <stripe-pricing-table
        pricing-table-id={NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
        publishable-key={NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        customer-email={email}
      ></stripe-pricing-table>
    </div>
  );
}
