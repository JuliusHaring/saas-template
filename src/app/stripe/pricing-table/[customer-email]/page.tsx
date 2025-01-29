import Script from "next/script";

export default function PricingTablePage({
  params,
}: {
  params: { "customer-email": string };
}) {
  const customerEmail = decodeURIComponent(params["customer-email"]);

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
