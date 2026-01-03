import { sendVerificationEmail } from "@/helper/send-verify-email";
import prisma from "@/lib/db";
import signupSchema from "@/schemas/sign-up";
import { generateAccessToken, generateRefreshToken } from "@/utils/generate-token";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const parsedData = signupSchema.safeParse(await req.json())

    if (!parsedData.success) {
        console.log(parsedData.error.format())
        return Response.json({
            msg: "invalid credentials",
            error: parsedData.error.flatten()
        }, {
            status: 400
        })
    }

    const {username, email, password, role} = parsedData.data

    try {
        const existingVerifiedUserwithUsername = await prisma.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        })

        if (existingVerifiedUserwithUsername) {
            return Response.json({
                msg: "username already exist"
            }, {
                status: 409
            })
        }

        const existingVerifiedUserwithEmail = await prisma.user.findFirst({
            where: {
                email,
            }
        })

        const twoFAenabled = role === "admin" ? true : false;

        const verifyCodeExpiry = new Date()
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

                
        const hashedPassword = await bcrypt.hash(password, 13);
        const hashedVerifyCode = await bcrypt.hash(verifyCode, 13);

        let newUser;

        if (existingVerifiedUserwithEmail) {
            if (existingVerifiedUserwithEmail.isVerified) {
                return Response.json({
                    msg: "user already exist",
                    status: false
                }, {
                    status: 409
                })
            } else {
                newUser = await prisma.user.update({
                    where: {
                        email
                    }, 
                    data: {
                        isVerified: false,
                        role: role,
                        email,
                        password: hashedPassword,
                        username: username,
                        verifyCode: hashedVerifyCode,
                        verifyCodeExpiry,
                        twoFAenabled
                    }
                })
            }
        } else {
            newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    twoFAenabled: false,
                    role: role,
                    password: hashedPassword,
                    isVerified: false,
                    verifyCodeExpiry,
                    verifyCode: hashedVerifyCode
                },
                select: {
                    username: true,
                    email: true,
                    id: true,
                    isVerified: true,
                    role: true
                }
            })
        }

        const accessToken = await generateAccessToken({userId: newUser.id, role: newUser.role})
        const refreshToken = await generateRefreshToken({userId: newUser.id, role: newUser.role})

        const hashRefreshtoken = await bcrypt.hash(refreshToken, 13)

        await prisma.refreshToken.create({
            data: {
                tokenHash: hashRefreshtoken,
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })


        // @ts-ignore
        const sendsVerificationEmailStatus = await sendVerificationEmail({email, username, verifyCode})

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
        
        return Response.json({
            msg: "signup succesfully, Please verify your Email"
        }, {
            status: 201
        })
    } catch (error) {
        return Response.json({
            msg: "internal server error while signing up",
            error: error instanceof Error ? error.message : "unknown error"
        }, {
            status: 500
        })
    }
}