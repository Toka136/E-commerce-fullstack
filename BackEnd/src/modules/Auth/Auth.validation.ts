import * as z from "zod";
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})
export const registerSchema = z.object({
    userName: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    role: z.enum(["admin", "user"]).optional(),
   
})
