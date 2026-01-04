import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PAGES = ["/home", "/login", "/signup"];
const PUBLIC_API_PREFIXES = ["/api/auth"]; // Ensure /api/auth/refresh-token starts with this

const ROLE_ROUTES = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Root Redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 2. Allow Public Assets & Auth APIs
  const isPublicPage = PUBLIC_PAGES.includes(pathname);
  const isPublicApi = PUBLIC_API_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isPublicPage || isPublicApi) {
    return NextResponse.next();
  }

  // 3. Token Extraction
  const token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // No refresh token? Kick to login
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // No access token? Go to refresh endpoint 
  // (Make sure this endpoint actually returns a 302 redirect back to the original page)
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/refresh-token", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Normalize casing (e.g., "STUDENT" -> "student")
    const role = (payload.role as string).toLowerCase();

    // 4. Role-Based Protection
    const isStudentRoute = pathname.startsWith("/student");
    const isTeacherRoute = pathname.startsWith("/teacher");
    const isAdminRoute = pathname.startsWith("/admin");

    if (
      (isStudentRoute && role !== "student") ||
      (isTeacherRoute && role !== "teacher") ||
      (isAdminRoute && role !== "admin")
    ) {
      // Redirect to their own dashboard instead of login if they are simply in the wrong place
      return NextResponse.redirect(new URL("/home", req.url));
    }

    // 5. Pass headers to Server Components/API routes
    const headers = new Headers(req.headers);
    headers.set("user-id", payload.userId as string);
    headers.set("user-role", role);

    return NextResponse.next({
      request: { headers },
    });

  } catch (error) {
    // Token expired or invalid
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};