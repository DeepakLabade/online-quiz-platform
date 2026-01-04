import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = req.headers.get("user-id");
    console.log(userId)
    const { quizId, studentId, questionId, selectedOption, isLastQuestion } = body;

    // 1. Find or Create the QuizAttempt
    // We look for an "IN_PROGRESS" attempt for this specific student and quiz
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

    // 2. Handle the Answer saving
    if (questionId && selectedOption) {
      // Fetch question to verify correctness and marks
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });

      if (!question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
      }

      const isCorrect = question.correctAnswer === selectedOption;
      const marksAwarded = isCorrect ? question.marks : -question.negativeMarks;

      // Upsert the answer: if they change their mind, it updates the same record
      await prisma.attemptAnswer.upsert({
        where: {
          // Note: You may need a unique constraint on [attemptId, questionId] in your schema
          // for this specific 'where' to work, otherwise use delete/create logic.
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

    // 3. If it's the last question, calculate total score and close the attempt
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

      return NextResponse.json({ message: "Quiz completed", score: finalScore });
    }

    return NextResponse.json({ message: "Progress saved", attemptId: attempt.id });

  } catch (error) {
    console.error("Quiz Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}