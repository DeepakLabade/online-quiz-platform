import prisma from "@/lib/db";

export async function GET(req: Request) {

    const role = req.headers.get("user-role");
    const userId = req.headers.get("user-id");

    if(!userId) {
        return Response.json({
            msg: "user unauthenticated",
            success: false
        }, {
            status: 400
        })
    }

    if(role !== "teacher") {
        return Response.json({
            msg: "invalid access",
            success: false
        }, {
            status: 400
        })
    }

    try {
        const grades = await prisma.quiz.findMany({
            distinct: ["grade"],
            select: {
                grade: true
            }
        })

        const totalQuizzez = await prisma.quiz.count({
            where: {
                createdById: userId
            }
        })

        return Response.json({
            msg: "get data successfully",
            success: true,
            grades,
            totalQuizzez
        }, {
            status: 200
        })
    } catch (error) {
        console.log("error while fetching teacher dashboard data: " + error)
        return Response.json({
            msg: "error while fetching teacher dashboard data: ",
            success: false,
            error
        }, {
            status: 400
        })
    }
}