import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  afterAuth(auth, req) {
    const url = req.nextUrl.clone();

    // Protect specific routes
    const isProtectedRoute = [
      "/dashboard",
      "/resume",
      "/interview",
      "/ai-cover-letter",
      "/onboarding",
    ].some((path) => url.pathname.startsWith(path));

    // If user not logged in and route is protected → redirect to sign in
    if (!auth.userId && isProtectedRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    return NextResponse.next();
  },
});

// Optional: prevent running on static files, just like before
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
