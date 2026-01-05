import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          select: {
            title: true,
            subject: true,
          }
        },
        answers: {
          include: {
            question: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    const analysis = attempt.answers.map((ans: any) => ({
      questionId: ans.questionId,
      questionText: ans.question.text,/*@ts-ignore */
      options: ans.question.options.map(o => o.text),
      selectedOption: ans.selected,
      correctOption: ans.question.correctAnswer,
      isCorrect: ans.isCorrect,
      marksAwarded: ans.marksAwarded,
      maxMarks: ans.question.marks
    }));

    return NextResponse.json({
      quizTitle: attempt.quiz.title,
      totalScore: attempt.score,
      status: attempt.status,
      submittedAt: attempt.submittedAt,
      analysis
    });

  } catch (error) {
    console.error("Result Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}