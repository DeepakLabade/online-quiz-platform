import prisma from "@/lib/db";

export async function GET(req: Request) {
    try {
        const userId = req.headers.get("user-id");
        const role = req.headers.get("user-role");

        if(!userId) {
            return Response.json({
                msg: "user is not authenticated",
                success: false
            }, {
                status: 411
            })
        }

        if(role != "teacher") {
            return Response.json({
                msg: "access denied",
                success: false
            }, {
                status: 411
            })
        }

        const quizzes = await prisma.quiz.findMany({
            where: {
                createdById: userId
            }
        })

        return Response.json({
            msg: "fetching all the quizzes",
            success: true,
            quizzes
        })
    } catch (error) {
        console.log("error while fetching quizzes: " + error)
        return Response.json({
            msg: "error while fetching quizzes",
            status: false,
            error
        })
    }
}   