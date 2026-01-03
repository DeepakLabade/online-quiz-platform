import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/api/auth/sign-in",
  "/api/auth/sign-up",
  "/api/auth/verify",
];

// Convert secret to Uint8Array (REQUIRED for jose)
const secret = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET!
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const headers = new Headers(req.headers);
    headers.set("user-id", payload.userId as string);
    headers.set("user-role", payload.role as string);

    return NextResponse.next({
      request: { headers },
    });
  } catch (error) {
    const res = NextResponse.redirect(new  URL("/login", req.url));
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}
