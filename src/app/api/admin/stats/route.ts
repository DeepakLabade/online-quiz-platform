import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const studentCount = await prisma.user.count({ where: { role: 'student' } });
    const quizCount = await prisma.quiz.count();
    const attemptCount = await prisma.quizAttempt.count();


    const recentAttempts = await prisma.quizAttempt.findMany({
      take: 6,
      orderBy: { startedAt: 'desc' },
      include: {
        student: { select: { username: true, email: true } },
        quiz: { select: { title: true } }
      }
    });

    return NextResponse.json({
      studentCount,
      quizCount,
      attemptCount,
      recentAttempts,
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}