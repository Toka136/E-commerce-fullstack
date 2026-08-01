import { categoryI } from "./Category.types"
import  categoryModal  from "./Category.modal"
export const addCategory=async(category:categoryI)=>{
    const newCategory=new categoryModal(category)
    return await newCategory.save()
}
export const getCategory=async(slug:string)=>{
    return await categoryModal.findOne({slug})
}
export const getCategories=async()=>{
    return await categoryModal.find()
}
export const deleteCategory=async(_id:string)=>{
    return await categoryModal.deleteOne({_id})
}
export const updateCategory=async(slug:string,description:string)=>{
    return await categoryModal.updateOne({slug},{description})
    
}