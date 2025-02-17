import NextAuth, { Session } from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  fullPublicRoutes,
  publicRoutes,
} from "@/routes";
import { NextRequest } from "next/server";

const { auth: middleware } = NextAuth(authConfig);

export default middleware(
  (req: NextRequest & { auth: Session | null }): Response | void => {
    const userAgent = req.headers.get("user-agent") || "";
    const isCrawler = /Googlebot|Bingbot|YandexBot/.test(userAgent);

    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

    const isFullPublicRoute = fullPublicRoutes.some((fullPublicRoute) => {
      if (nextUrl.pathname.startsWith(fullPublicRoute)) return true;
    });

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute || isFullPublicRoute || isCrawler) return;

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    }

    if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL("/login", nextUrl));
    }

    return;
  }
);

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sitemap/sitemap.xml).*)",
  ],
};
