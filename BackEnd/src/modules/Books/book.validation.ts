import * as z from "zod"
export const addBookSchema=z.object({
    title:z.string().min(3),
    author:z.string().min(3),
    description:z.string().min(3),
    price:z.number(),
    stock:z.number(),
    image:z.string().min(3).optional(),
    category:z.string().min(3),
    pages:z.number().min(1)
})