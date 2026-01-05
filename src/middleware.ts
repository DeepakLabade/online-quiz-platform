import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { toast } from "sonner";

const PUBLIC_PAGES = ["/login", "/signup"];
const PUBLIC_API_PREFIXES = ["/api/auth"];

const ROLE_ROUTES = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isPublicPage = PUBLIC_PAGES.includes(pathname);
  const isPublicApi = PUBLIC_API_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isPublicPage || isPublicApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/refresh-token", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    
    const role = (payload.role as string).toLowerCase();

    const isStudentRoute = pathname.startsWith("/student");
    const isTeacherRoute = pathname.startsWith("/teacher");
    const isAdminRoute = pathname.startsWith("/admin");

    if (
      (isStudentRoute && role !== "student") ||
      (isTeacherRoute && role !== "teacher") ||
      (isAdminRoute && role !== "admin")
    ) {
      console.log("invalid permissoins")
      toast("you dont have enough permissions")
      return NextResponse.redirect(new URL("/home", req.url));
    }

    const headers = new Headers(req.headers);
    headers.set("user-id", payload.userId as string);
    headers.set("user-role", role);

    return NextResponse.next({
      request: { headers },
    });

  } catch (error) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};