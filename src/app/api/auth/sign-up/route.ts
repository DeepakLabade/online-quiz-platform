import { verifyUserEmail } from "@/email/verify-user-email";
import prisma from "@/lib/db";
import { transporter } from "@/lib/node-mail";
import signupSchema from "@/schemas/sign-up";
import { generateAccessToken, generateRefreshToken } from "@/utils/generate-token";
import { render } from "@react-email/render";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = signupSchema.safeParse(body);

    if (!parsedData.success) {
      return Response.json({
        msg: "Invalid input data",
        errors: parsedData.error.flatten()
      }, { status: 400 });
    }

    const { username, email, password, role } = parsedData.data;

    // 1. Check if verified username already exists
    const existingUserByUsername = await prisma.user.findFirst({
      where: { username, isVerified: true }
    });

    if (existingUserByUsername) {
      return Response.json({ msg: "Username is already taken" }, { status: 409 });
    }

    // 2. Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    const hashedPassword = await bcrypt.hash(password, 12);
    const twoFAenabled = role === "admin";

    let user;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({ msg: "User with this email already exists" }, { status: 409 });
      } else {
        // Update unverified user
        user = await prisma.user.update({
          where: { email },
          data: {
            username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry,
            role,
            twoFAenabled
          }
        });
      }
    } else {
      // Create brand new user
      user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry,
          role,
          isVerified: false,
          twoFAenabled
        }
      });
    }

    // 3. Token Generation & Storage
    const accessToken = await generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await generateRefreshToken({ userId: user.id, role: user.role });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10); // Lower rounds for speed on transient tokens

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    const emailHtml = await render(verifyUserEmail({ 
        username, 
        OTP: verifyCode 
      }));
      
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Verification Code for Quiz Platform',
        html: emailHtml, 
      };

    //@ts-ignore
    await transporter.sendMail(mailOptions);

    // 5. Set Cookies
    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    cookieStore.set("refreshToken", refreshToken, cookieOptions);
    cookieStore.set("accessToken", accessToken, cookieOptions);

    return Response.json({
      msg: "Signup successful. Please check your email for the verification code.",
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error("SIGNUP_ERROR:", error);
    return Response.json({
      msg: "Internal server error during signup",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}