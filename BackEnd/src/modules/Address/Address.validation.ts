import * as z from "zod"
export const addSchema=z.object({
    title:z.string().min(2),
    city:z.string(),
    addressLine1:z.string(),
    addressLine2:z.string().optional(),
    state:z.string(),
    country:z.string(),
    postalCode:z.string(),
    mobile:z.string().min(11).max(11),
    isDefault:z.boolean().optional()

    
})
export const updateSchema=z.object({
    addressId:z.string(),
    title:z.string().min(2).optional(),
    city:z.string().optional(),
    addressLine1:z.string().optional(),
    addressLine2:z.string().optional(),
    state:z.string().optional(),
    country:z.string().optional(),
    postalCode:z.string().optional(),
    mobile:z.string().min(11).max(11).optional(),
    isDefault:z.boolean().optional()

    
})
