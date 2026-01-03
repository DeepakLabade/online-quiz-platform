import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { verifyCode, email } = await req.json();

    const currUser = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        username: true,
        isVerified: true,
        verifyCode: true,
        verifyCodeExpiry: true,
      },
    });

    if (!currUser) {
      return Response.json({
        msg: "user not exist",
      });
    }

    if(currUser.isVerified) {
        return Response.json({
            msg: "user already verified"
        })
    }

    if (!currUser.verifyCodeExpiry) {
        return Response.json(
          { msg: "Verification code expired" },
          { status: 400 }
        );
      }

    // const isCodeValid = await bcrypt.compare(verifyCode, currUser.verifyCode)
    const isCodeValid = verifyCode == currUser.verifyCode
    const isCodeNotExpired = new Date(currUser.verifyCodeExpiry) > new Date()

    if(!isCodeValid) {
        return Response.json({
            msg: "Incorrect Code",
            success: false
        }, {
            status: 400
        })
    }

    if(!isCodeNotExpired) {
        return Response.json({
            msg: "code is expired",
            success: false
        }, {
            status: 400
        })
    }

    const updatedUser = await prisma.user.update({
        where: {
            email
        }, 
        data: {
            isVerified: true,
            verifyCode: undefined,
            verifyCodeExpiry: undefined
        }
    })

    return Response.json({
        msg: "user is verified",
        success: true
    }, {
        status: 200
    })
    
} catch (error) {
    console.log("error while verifying code: ", error)
    return Response.json({
        msg: "error while verifying code",
        success: false
    }, {status :500})
}
}