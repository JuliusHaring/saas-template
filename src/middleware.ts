import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const defaultRedirect = "/";
  const loggedInRedirect = "/admins/chatbots";

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const userId = (await auth()).userId;

  if (userId && isProtectedRoute(req)) {
    const email = (await (await clerkClient()).users.getUser(userId))
      .primaryEmailAddress?.emailAddress;

    if (!email) {
      return redirect(req, defaultRedirect);
    }

    const paymentsUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/stripe/pricing-table/${encodeURIComponent(email)}`;
    const isPaymentsUrl = req.nextUrl.toString() === paymentsUrl;

    const hasSubscription = await checkSubscription(userId, req);

    if (hasSubscription && isPaymentsUrl) {
      return redirect(req, loggedInRedirect);
    }

    if (!hasSubscription && !isPaymentsUrl) {
      return redirect(req, paymentsUrl);
    }
  }
});

async function checkSubscription(
  userId: string,
  req: NextRequest,
): Promise<boolean> {
  try {
    const response = await fetch(
      new URL("/api/stripe/subscription/check", req.nextUrl.origin),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      },
    );

    if (!response.ok) {
      console.error("Subscription check failed");
      return false;
    }

    const { hasSubscription } = await response.json();
    return hasSubscription ?? false;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

function redirect(req: NextRequest, url: string): NextResponse {
  return NextResponse.redirect(new URL(url, req.nextUrl.origin));
}
