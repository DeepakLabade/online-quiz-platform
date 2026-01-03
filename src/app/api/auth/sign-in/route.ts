import prisma from "@/lib/db";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generate-token";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
        isVerified: true,
      },
      select: {
        email: true,
        password: true,
        role: true,
        id: true,
        isVerified: true,
      },
    });

    if (!existingUser) {
      return Response.json(
        {
          msg: "user does not exist or not verified",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return Response.json(
        {
          msg: "password is incorrect",
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    await prisma.refreshToken.deleteMany({
        where: { userId: existingUser.id },
      });

    const refreshToken = await generateRefreshToken({
      userId: existingUser.id,
      role: existingUser.role,
    });
    const accessToken = await generateAccessToken({
      userId: existingUser.id,
      role: existingUser.role,
    });

    const hashRefreshtoken = await bcrypt.hash(refreshToken, 13);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshtoken,
        userId: existingUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return Response.json(
      {
        msg: "user loggedIn successfully",
        success: true,
        role: existingUser.role
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ msg: "Internal server error" }, { status: 500 });
  }
}
