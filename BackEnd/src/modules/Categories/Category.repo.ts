import { categoryI } from "./Category.types"
import {prisma} from "../../config/prisma"
export const addCategory=async(category:categoryI)=>{
    const newCategory=await prisma.category.create({data:category})
    return  newCategory
}
export const getCategory=async(slug:string)=>{
    return await prisma.category.findUnique({where:{slug}})
}
export const getCategories=async()=>{
    return await prisma.category.findMany()
}
export const deleteCategory=async(id:string)=>{
    return await prisma.category.delete({where:{id}})
}
export const updateCategory=async(slug:string,description:string)=>{
    return await prisma.category.update({where:{slug},data:{description}})
    
}