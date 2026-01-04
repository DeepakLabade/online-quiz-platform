import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PAGES = [
  "/home",
  "/login",
  "/signup",
];

const PUBLIC_API_PREFIXES = [
  "/api/auth",
];

// Convert secret to Uint8Array (REQUIRED for jose)
const secret = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET!
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Redirect only ROOT
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // ✅ Allow public pages (EXACT match)
  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow public auth APIs
  if (PUBLIC_API_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 🔐 Protected routes
  const token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value

  if(!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/refresh-token", req.url));
  }


  try {
    const { payload } = await jwtVerify(token, secret);

    const headers = new Headers(req.headers);
    headers.set("user-id", payload.userId as string);
    headers.set("user-role", payload.role as string);

    return NextResponse.next({
      request: { headers },
    });
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}

/* 🔥 MOST IMPORTANT PART (DO NOT SKIP) */
export const config = {
  matcher: [
    /*
      Exclude:
      - next static files (css/js)
      - image optimizer
      - favicon
    */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
