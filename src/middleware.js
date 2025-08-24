import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("authToken")?.value;
  const url = req.nextUrl.clone();

  const publicPaths = [
    "/login",
    "/register",
    "/favicon.ico",
    "/api/auth/login",
    "/api/auth/register",
    "/blog",
  ];

  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    const redirectResponse = NextResponse.redirect(new URL("/login", req.url));
    redirectResponse.headers.set("x-middleware-cache", "no-cache");
    return redirectResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
