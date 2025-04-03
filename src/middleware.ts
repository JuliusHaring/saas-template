import { getSession } from "@/lib/auth/session";
import { UserIdType } from "@/lib/db/types";
import { fetchJson } from "@/lib/utils/fetch";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const urlPayment = "/stripe/pricing-table/";
  const urlAdmin = "/dashboard";
  const urlLogin = "/auth/login";

  const isNext = pathname.startsWith("/_next/");
  const isDefault = pathname === "/";
  const isPricingTable = pathname.startsWith("/stripe/pricing-table");
  const isAdmin = pathname.startsWith(urlAdmin);
  const isLogin = pathname === urlLogin;
  const isAPI = pathname.startsWith("/api/");

  if ([isAPI || isNext].some((val) => val)) {
    return NextResponse.next();
  }

  const session = await getSession(req);

  if (isDefault && !!session.userId) {
    return redirect(req, urlAdmin);
  }

  if (isAdmin || isPricingTable) {
    if (!session.userId) {
      return redirect(req, urlLogin);
    }

    if (isLogin) return redirect(req, urlAdmin);

    const hasSubscription = await checkSubscription(session.userId, req);
    const email = await getEmail(session.userId, req);

    if (!hasSubscription && !isPricingTable)
      return redirect(req, urlPayment + email);

    if (hasSubscription && isPricingTable) return redirect(req, urlAdmin);
  }

  return NextResponse.next();
}

async function getEmail(userId: UserIdType, req: NextRequest) {
  const url = new URL("/api/user/email", req.nextUrl.origin).toString(); // ✅ Convert to absolute URL
  return fetchJson<{ email: string }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }), // ✅ Pass userId in request body
  }).then((res) => res.email);
}

function redirect(req: NextRequest, url: string) {
  return NextResponse.redirect(new URL(url, req.url));
}

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
