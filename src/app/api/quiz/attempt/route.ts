import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = req.headers.get("user-id");
    console.log(userId)
    const { quizId, questionId, selectedOption, isLastQuestion } = body;

    let attempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId,
        studentId: userId!,
        status: "inProgress", 
      },
    });

    if (!attempt) {
      attempt = await prisma.quizAttempt.create({
        data: {
          quizId,
        studentId: userId!,
          status: "inProgress",
        },
      });
    }

    if (questionId && selectedOption) {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });

      if (!question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
      }

      const isCorrect = question.correctAnswer === selectedOption;
      const marksAwarded = isCorrect ? question.marks : -question.negativeMarks;

      await prisma.attemptAnswer.upsert({
        where: {
          id: `${attempt.id}-${questionId}`, 
        },
        update: {
          selected: selectedOption,
          isCorrect,
          marksAwarded,
        },
        create: {
          id: `${attempt.id}-${questionId}`,
          attemptId: attempt.id,
          questionId,
          selected: selectedOption,
          isCorrect,
          marksAwarded,
        },
      });
    }

    const totalQuizMarks = await prisma.question.count({
      where: {
        quizId
      }
    })

    if (isLastQuestion) {
      const allAnswers = await prisma.attemptAnswer.findMany({
        where: { attemptId: attempt.id },
      });

      const finalScore = allAnswers.reduce((acc, curr) => acc + curr.marksAwarded, 0);

      await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          status: "submitted",
          score: finalScore,
          submittedAt: new Date(),
        },
      });

      return NextResponse.json({ message: "Quiz completed", score: finalScore, totalQuizMarks });
    }

    return NextResponse.json({ message: "Progress saved", attemptId: attempt.id });

  } catch (error) {
    console.error("Quiz Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}