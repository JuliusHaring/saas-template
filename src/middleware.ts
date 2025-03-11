import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const defaultRedirect = "/";
  const isDefaultUrl = req.nextUrl.pathname === defaultRedirect;
  const loggedInRedirect = "/admin/chatbots";

  const isPageUrl =
    ["/_next", "/api"].every(
      (path) => !req.nextUrl.pathname.startsWith(path),
    ) &&
    (["/admin", "/stripe"].some((path) =>
      req.nextUrl.pathname.startsWith(path),
    ) ||
      req.nextUrl.pathname === defaultRedirect);

  if (!isPageUrl) return NextResponse.next();

  const userId = (await auth()).userId;

  if (isPageUrl && !!userId) {
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

  if (isPageUrl && !userId && !isDefaultUrl) {
    return redirect(req, defaultRedirect);
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
