// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes using regex-style matchers
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  // If user not signed in and accessing protected route → redirect
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url); // ✅ builds full absolute URL
    return NextResponse.redirect(signInUrl);
  }

  // Otherwise allow request
  return NextResponse.next();
});

// Run Clerk middleware for all pages except static assets and APIs
export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
