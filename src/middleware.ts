import { isDevModeEnabled } from "@/lib/utils/dev-mode";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

async function getEmail(userId: string, req: NextRequest): Promise<string> {
  const response = await fetch(
    new URL(`/api/user/get-email`, req.nextUrl.origin),
    {
      method: "POST",
      body: JSON.stringify({ userId }),
    },
  );
  return response.json().then((res) => res.email);
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();

    const userId = isDevModeEnabled() ? "test" : (await auth()).userId;
    if (!userId) {
      return Response.redirect("/");
    }

    // Call API route to check subscription (Edge-safe)
    const response = await fetch(
      new URL(`/api/stripe/subscription/check`, req.nextUrl.origin),
      {
        method: "POST",
        body: JSON.stringify({ userId }),
      },
    );

    const { hasSubscription } = await response.json();

    const email = await getEmail(userId, req);
    if (typeof email === "undefined") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }

    if (!hasSubscription) {
      return NextResponse.redirect(
        new URL(`/stripe/pricing-table/${email}`, req.nextUrl.origin),
      );
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
