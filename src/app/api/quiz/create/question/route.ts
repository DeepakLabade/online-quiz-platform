import prisma from "@/lib/db"

export async function POST(req: Request) {
    try {
        const {question, correctAnswer, quizId, options} = await req.json()

        const createdQuestion = await prisma.question.create({
            data: {
                correctAnswer,
                difficulty: "medium",
                marks: 1,
                text: question,
                type: "MCQ",
                quizId: quizId
            }, select: {
                id: true,
                text: true
            }
        })

        const createdOptions = await prisma.option.createMany({
            data: options.map((option: string) => ({
                questionId: createdQuestion.id,
                text: option,
            }))
        })


        return Response.json({
            msg: "question created Successfully",
            success: true,
            createdQuestion
        }, {
            status: 201
        })
    } catch (error) {
        console.log("error while creating questions" + error)
        return Response.json({
            msg: "error while creating questions",
            error,
            success: false
        }, {
            status: 400
        })
    }
}