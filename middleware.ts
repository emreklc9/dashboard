import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { getUserFromToken } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/login"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/image") ||
    pathname.startsWith("/video") ||
    pathname === "/favicon.ico" ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|mov)$/i.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromToken(token);
  const isLoginPage = isPublicPath(pathname);

  if (!user && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(user ? "/dashboard" : "/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
