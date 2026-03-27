import { NextResponse, type NextRequest } from "next/server";
import { authClient } from "@/lib/auth/auth-client";

const publicRoutes = ["/auth/login", "/auth/register"];
const protectedRoutes = ["/", "/contacts", "/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  // if (publicRoutes.some((route) => pathname.startsWith(route))) {
  //   // If logged in and trying to access login/register, redirect to home
  //   const { data: session } = await authClient.getSession();
  //   console.log("Session in middleware public routes:", session);
  //   if (session?.session) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  //   return NextResponse.next();
  // }

  // Check if it's a protected route
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verify session using the existing auth client
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  });

  if (!session?.session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
