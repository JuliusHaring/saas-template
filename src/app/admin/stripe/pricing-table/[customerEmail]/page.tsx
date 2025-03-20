// @ts-nocheck
"use client";
import {
  NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} from "@/lib/utils/environment";
import Script from "next/script";

export default async function PricingTablePage({
  params,
}: {
  params: Promise<{ customerEmail: string }>;
}) {
  const rawEmail = (await params).customerEmail;
  const customerEmail = decodeURIComponent(rawEmail);

  return (
    <div className="w-full">
      <Script
        strategy="lazyOnload"
        src="https://js.stripe.com/v3/pricing-table.js"
      ></Script>

      <stripe-pricing-table
        pricing-table-id={NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
        publishable-key={NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        customer-email={customerEmail}
      ></stripe-pricing-table>
    </div>
  );
}
