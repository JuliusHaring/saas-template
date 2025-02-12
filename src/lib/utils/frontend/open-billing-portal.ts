export const openBillingPortal = async () => {
  try {
    const res = await fetch("/api/stripe/billing-portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirect user to Stripe billing portal
    } else {
      console.error("Error fetching billing portal URL:", data.error);
    }
  } catch (err) {
    console.error("Failed to open billing portal:", err);
  }
};
