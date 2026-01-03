import prisma from "@/lib/db";

export async function GET(req: Request) {
    try {
        const allQuizzes = await prisma.quiz.findMany({})

        return Response.json({
            msg: "fetched data successfully",
            success: true,
            allQuizzes
        }, {status: 200})
    } catch (error) {
        console.log("error while fetching all quizzes: " + error)
        return Response.json({
            msg: "error while fetching all data",
            success: false,
            error
        })
    }
}