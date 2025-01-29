// @ts-nocheck
import Script from "next/script";

export default async function PricingTablePage({
  params,
}: {
  params: Promise<{ customerEmail: string }>;
}) {
  const customerEmail = (await params).customerEmail;

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src="https://js.stripe.com/v3/pricing-table.js"
      ></Script>

      <stripe-pricing-table
        pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
        publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        customer-email={customerEmail}
      ></stripe-pricing-table>
    </>
  );
}
