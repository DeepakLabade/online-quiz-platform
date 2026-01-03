import prisma from "@/lib/db"

export async function POST(req: Request) {
    try {
        const {questionId, optionText} = await req.json()

        const createdOption = await prisma.option.create({
            data: {
                text: optionText,
                questionId
            }
        })

        return Response.json({
            msg: "option created successfully",
            success: true,
            createdOption
        })
    } catch (error) {
        
    }
}