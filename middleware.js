// middleware.js
export const runtime = "nodejs";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();
  const { userId, redirectToSignIn } = authData;

  // Redirect to sign-in if user is not authenticated and route is protected
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Allow request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|static|favicon.ico).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
