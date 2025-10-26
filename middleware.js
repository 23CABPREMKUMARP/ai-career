// middleware.js
import { auth } from "@clerk/nextjs/edge";
import { NextResponse } from "next/server";

// Protected routes
const protectedRoutes = [
  "/dashboard",
  "/resume",
  "/interview",
  "/ai-cover-letter",
  "/onboarding",
];

export async function middleware(req) {
  const { userId } = auth(req);
  const url = req.nextUrl.clone();

  // Check if current route is protected
  const isProtected = protectedRoutes.some((path) =>
    url.pathname.startsWith(path)
  );

  // Redirect to sign-in if user is not authenticated
  if (isProtected && !userId) {
    url.pathname = "/sign-in"; // your Clerk sign-in route
    return NextResponse.redirect(url);
  }

  // Allow request to continue
  return NextResponse.next();
}

// Run middleware only on protected routes & API
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
