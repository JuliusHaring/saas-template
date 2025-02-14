// @ts-nocheck
import { EyeCatcher } from "@/app/page";
import Script from "next/script";

export default async function PricingTablePage({
  params,
}: {
  params: Promise<{ customerEmail: string }>;
}) {
  const rawEmail = (await params).customerEmail;
  const customerEmail = decodeURIComponent(rawEmail);

  return (
    <div className="my-10">
      <h1 className="text-center my-10 text-2xl font-semibold">KnexAI</h1>
      <div className="text-xl">
        <EyeCatcher />
      </div>

      <Script
        strategy="lazyOnload"
        src="https://js.stripe.com/v3/pricing-table.js"
      ></Script>

      <stripe-pricing-table
        pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
        publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        customer-email={customerEmail}
      ></stripe-pricing-table>
    </div>
  );
}
