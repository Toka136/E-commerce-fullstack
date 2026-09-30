import * as z from "zod"
export const updateProfileSchema=z.object({
    userName: z.string().min(2).optional(),
    email: z.email().optional(),
    phoneNumber: z.string().min(11).max(11).optional(),
    image: z.string().optional()
})