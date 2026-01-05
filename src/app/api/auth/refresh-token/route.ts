import prisma from "@/lib/db";
import { generateAccessToken } from "@/utils/generate-token";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET!
);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return Response.json(
        { msg: "Refresh token missing", success: false },
        { status: 401 }
      );
    }

    let payload: any;
    try {
      const verified = await jwtVerify(refreshToken, REFRESH_SECRET);
      payload = verified.payload;
    } catch {
      return Response.json(
        { msg: "Invalid refresh token", success: false },
        { status: 401 }
      );
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedToken) {
      return Response.json(
        { msg: "Refresh token expired", success: false },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(refreshToken, storedToken.tokenHash);

    if (!isValid) {
      await prisma.refreshToken.deleteMany({
        where: { userId: payload.userId },
      });

      return Response.json(
        { msg: "Refresh token compromised", success: false },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });

    if (!user) {
      return Response.json({ msg: "User not found" }, { status: 404 });
    }

    const newAccessToken = await generateAccessToken({
      userId: payload.userId,
      role: user.role,
    });

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return Response.json(
      { 
        msg: "Access token refreshed", 
        success: true, 
        role: user.role
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Refresh token error:", error);
    return Response.json(
      { msg: "Internal server error", success: false },
      { status: 500 }
    );
  }
}