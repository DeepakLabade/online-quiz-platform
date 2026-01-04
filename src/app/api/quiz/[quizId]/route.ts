import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = await params;

    if (!quizId) {
      return NextResponse.json(
        { message: "Quiz ID is missing" },
        { status: 400 }
      );
    }

    // Fetch quiz with nested questions and nested options
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: {
          include: {
            options: true, // This gets the specific options for each question
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    // Clean response
    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        durationMinutes: quiz.durationMinutes,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          text: q.text, // Matching your schema's 'text' field
          options: q.options.map((o) => ({
            id: o.id,
            text: o.text,
          })),
          marks: q.marks,
          // Note: We do NOT send 'correctAnswer' here to prevent cheating
          // via browser inspection/network tab.
        })),
      },
    });

  } catch (error) {
    console.error("GET Quiz Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}