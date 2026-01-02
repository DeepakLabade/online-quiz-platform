import z from "zod";

const signupSchema = z.object({
    username: z.string().min(2).max(30),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string().min(6).max(20),
    role: z.enum(["student", "teacher", "admin"])
})

export default signupSchema