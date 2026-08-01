import slugify  from "slugify";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./Category.repo"
import { categoryI } from "./Category.types"
import { responseStatus } from "../../utils/responseStatus";
import appError from "../../utils/errorClass";
import { getBooksbyCategory } from "../Books/book.repo";

export const addCategoryS=async(category:categoryI)=>{
    const slug=slugify(category.name, {
    lower: true,
    strict: true
    });
    const categoryExist=await getCategory(slug)
    if(categoryExist){
        throw new appError("Category Already Exist",400,responseStatus.FAILED)
    }
    category.slug=slug
    const newCategory=await addCategory(category)
    return  newCategory
}
export const getCategoryS=async(slug:string)=>{
    const category= await getCategory(slug)
    if(!category){
        throw new appError("Category Not Found",400,responseStatus.FAILED)
    }
    return category
}
export const getCategoriesS=async()=>{
    return getCategories()
}
export const deleteCategoryS=async(id:string)=>{
    const products=await getBooksbyCategory(id)
    if(products.length>0){
        throw new appError("Category Has Products",400,responseStatus.FAILED)
    }
    else{
        await deleteCategory(id)
    }
}
export const updateCategoryS=async(slug:string,description:string)=>{
    const categoryExist=await getCategory(slug)
    if(!categoryExist){
        throw new appError("Category Not Found",400,responseStatus.FAILED)
    }
    const newCategory=await updateCategory(slug,description)
    return newCategory
}