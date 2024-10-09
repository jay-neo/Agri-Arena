import NextAuth from "next-auth";
import { authConfig } from "~/auth.config";
import { AUTH_ROUTES, AUTHPAGE, HOMEPAGE, PUBLIC_ROUTES } from "~/lib/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isAuthenticated && isAuthRoute) {
    return Response.redirect(new URL(HOMEPAGE, nextUrl));
  }

  if (isPublicRoute || isAuthenticated) return;

  return Response.redirect(new URL(AUTHPAGE, nextUrl));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
