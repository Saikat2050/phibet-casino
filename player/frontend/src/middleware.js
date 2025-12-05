import { NextResponse } from "next/server";
import { getCookie } from "./utils/cookiesHelper";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    "/vip",
    "/access-not-allowed",
    "/user",
    "/provider",
    "/category",
    "/game",
    "/favorite",
    "/checkout",
  ];

  // Exclude static files, Next.js internals, and assets
  if (
    pathname.startsWith("/_next") || // Next.js internals
    pathname.startsWith("/static") || // Static assets
    pathname.startsWith("/assets") || // Other assets
    pathname === "/favicon.ico" || // Favicon
    pathname === "/robots.txt" || // Robots.txt
    pathname.endsWith(".pdf") || // PDF files
    pathname.startsWith("/provider") ||
    pathname.includes("/demo") || pathname.startsWith("/demo") ||
    pathname.includes("/user/forgotPassword") ||
    pathname.startsWith("/.well-known") // Other static paths
  ) {
    return NextResponse.next();
  }

  // Check if the path matches a protected route
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    // Check for access token
    const accessToken = getCookie("accessToken", { req: request });

    if (!accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except API and static files
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|assets|static).*)",
  ],
};
