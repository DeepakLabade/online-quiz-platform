import { sendVerificationEmail } from "@/helper/send-verify-email";
import prisma from "@/lib/db";
import signupSchema from "@/schemas/sign-up";
import bcrypt from "bcryptjs";

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


        if (existingVerifiedUserwithEmail) {
            if (existingVerifiedUserwithEmail.isVerified) {
                return Response.json({
                    msg: "user already exist",
                    status: false
                }, {
                    status: 409
                })
            } else {
                const newUser = await prisma.user.update({
                    where: {
                        email
                    }, 
                    data: {
                        isVerified: false,
                        password: hashedPassword,
                        username: username,
                        verifyCode: hashedVerifyCode,
                        verifyCodeExpiry,
                        twoFAenabled
                    }
                })
            }
        } else {
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    twoFAenabled: false,

                    password: hashedPassword,
                    isVerified: false,
                    verifyCodeExpiry,
                    verifyCode: hashedVerifyCode
                },
                select: {
                    username: true,
                    email: true,
                    id: true,
                    isVerified: true
                }
            })
        }
        // @ts-ignore
        const sendsVerificationEmailStatus = await sendVerificationEmail({email, username, verifyCode})
        
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