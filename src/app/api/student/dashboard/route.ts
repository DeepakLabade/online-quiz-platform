import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("user-id");

    if (!userId) {
      return Response.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }

    const totalQuizzes = await prisma.quizAttempt.count({
      where: {
        studentId: userId,
      },
    });

    const attemptedQuizzes = await prisma.quizAttempt.findMany({
      where: {
        studentId: userId,
      },
      select: {
        id: true,
        quizId: true,
        status: true,
        score: true,
        startedAt: true,
        submittedAt: true,
        quiz: {
          select: {
            title: true,
            subject: true,
            grade: true,
          },
        },
        student: {
            select: {
                username: true
            }
        }
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    console.log("totalquizzes: " + totalQuizzes)
    console.log("attempted Quizzes: " + attemptedQuizzes)

    return Response.json({
      success: true,
      msg: "Fetched attempted quizzes",
      totalQuizzes,
      attemptedQuizzes,//@ts-ignore
    });

  } catch (error) {
    console.error("Fetch attempts error:", error);

    return Response.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
