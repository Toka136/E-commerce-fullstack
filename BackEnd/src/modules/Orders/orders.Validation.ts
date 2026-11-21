import * as z from "zod"
export const orderStatusSchema=z.object({
   
    status:z.enum(["pending","processing","shipped","delivered","cancelled"])
   
})

export const orderCreationSchema=z.object({
    paymentMethod:z.enum(["COD","ONLINE"]),
    address:z.object({
        addressLine1:z.string(),
        addressLine2:z.string().optional(),
        city:z.string(),
        state:z.string(),
        country:z.string(),
        postalCode:z.string(),
        mobile:z.string().min(11).max(11)
    })

})