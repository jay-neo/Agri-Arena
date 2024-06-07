// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "~/auth";

export default auth((req) => {
  const currentPath = req.nextUrl.pathname;

  if (!req.auth) {
    return NextResponse.redirect(
      new URL(`/login?next=${currentPath}`, req.url)
    );
  }
});

// Configure protected routes
export const config = {
  matcher: ["/social/:path*"],
};
