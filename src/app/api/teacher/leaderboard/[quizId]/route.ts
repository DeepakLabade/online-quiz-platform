import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }

    const leaderboard = await prisma.quizAttempt.findMany({
      where: {
        quizId: quizId,
        status: "submitted",
      },
      select: {
        id: true,
        score: true,
        submittedAt: true,
        student: {
            select: {
                username: true,
                email: true
            }
        }
      },
      orderBy: [
        { score: "desc" },
      ],
    });

    console.log("leaderboard: " + JSON.stringify(leaderboard))

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}