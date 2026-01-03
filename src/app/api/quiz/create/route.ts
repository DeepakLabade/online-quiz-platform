import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {

        const userId = req.headers.get("user-id");
        const role = req.headers.get("user-role");
    
        
      if (!userId || !role) {
        return Response.json(
          { msg: "Unauthorized" },
          { status: 401 }
        );
      }

      if(role != "teacher") {
        return Response.json({
            msg: "you dont have a access",
            success: false
        }, {
            status: 409
        })
      }
      
        const {title, subject, grade, difficulty, duration, tags} = await req.json()

        console.log(userId)

        const createdQuiz = await prisma.quiz.create({
            data: {
                difficulty,
                durationMinutes: duration,
                grade,
                subject,
                title,
                tags,
                Duration: 30,
                createdById: userId
            }, select: {
                id: true,
            }
        })

        return Response.json({
            msg: "quiz created sucessfully",
            success: true,
            quizId: createdQuiz.id
        }, {
            status: 201
        })
    } catch (error) {
        console.log("error while creating a quiz" + error)
        return Response.json({
            msg: "error while creating quiz",
            error,
            success: false
        }, {
            status: 400
        })
    }
}