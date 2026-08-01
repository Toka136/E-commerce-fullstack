import { CursorTimeoutMode } from "mongodb";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { deleteBook, findBookById, findBookByName, findBooks, getBooksCount, insertBook, updateBook } from "./book.repo";
import { editBookI, bookI, queryI, addBookBodyI, insertBookI } from "./book.types";
import fs from "fs"
import path from "path";
import { getCategory } from "../categories/Category.repo";
import { getBookReviews } from "../reviews/review.repo";
export const addBook_S=async(body:addBookBodyI,file?:Express.Multer.File)=>{  
    const {title,author,slug,price,description,stock}=body
    const bookCategory=await getCategory(slug)
    if(!bookCategory){
        throw new appError("Category Not Found",400,responseStatus.FAILED)
    }
    const oldBook=await findBookByName(title)
    if(oldBook){
        throw new appError("Book Already Exists",400,responseStatus.FAILED)
    }
       const newwBook:insertBookI={
        title,
        author,
        category:bookCategory._id,
        price,
        description,
        stock,
        coverImage:""
    }

    if(file){
        newwBook.coverImage=file.filename
    }
    const result=await insertBook(newwBook)
    return result
    

}
export const editBook_S=async(body:editBookI,file?:Express.Multer.File)=>{
    console.log("body of edited book",body)
    const book=await findBookById(body._id)
    if(!book)
    {
        throw new appError("Book Not Found",400,responseStatus.FAILED)
    }
    let bookCategory=book.category
    if(body.slug){
        const category=await getCategory(body.slug)
    if(!category){
        throw new appError("Category Not Found",400,responseStatus.FAILED)
    }
        bookCategory=category._id
        
    }
    const newBook:insertBookI={
        title:book.title,
        author:body.author?body.author:book.author,
        category:bookCategory,
        price:body.price?body.price:book.price,
        description:body.description?body.description:book.description,
        stock:body.stock?body.stock:book.stock,
        coverImage:book.coverImage
    }
    
    if(file){
        const oldImagePath = path.join(__dirname, '../../Uploads', book.coverImage);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath)
        newBook.coverImage=file.filename
    }
    const result=await updateBook(newBook,body._id)
    return result
}
export const deleteBook_S=async(id:string)=>{
    const book=await findBookById(id)
    if(!book){
        throw new appError("Book Not Found",400,responseStatus.FAILED)
    }
    const imagePath = path.join(__dirname, '../../Uploads', book.coverImage);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
    await deleteBook(id)
}
export const getBook_S=async(id:string)=>{
    const book=await findBookById(id)
    if(!book){
        throw new appError("Book Not Found",400,responseStatus.FAILED)
    }
    const bookReviews=await getBookReviews(id)
    return {
        book,
        bookReviews
    }
}
export const getBooks_S=async(query:queryI)=>{
 const pageSize=query.pageSize?parseInt(String(query.pageSize)):10
    const currentPage=query.currentPage?parseInt(String(query.currentPage)):1
    const skip=(pageSize*(currentPage-1))
     const filter: any = {};
    if (query.searchText) {
        const searchText = query.searchText;
        filter.$or = [{title:{$regex:searchText,$options:"i"}},{author:{$regex:searchText,$options:"i"}},{description:{$regex:searchText,$options:"i"}}]
    }
    if(query.category){
        const category=await getCategory(query.category)
        if(!category){
            throw new appError("Category Not Found",400,responseStatus.FAILED)
        }
        filter.category=category._id
    }
    if(query.minPrice||query.maxPrice){
        filter.price={}
        if(query.minPrice){
        filter.price.$gte= Number(query.minPrice);
    }
        if(query.maxPrice){
        filter.price.$lte= Number(query.maxPrice);
    }
    }
    
    let sort={}
    switch(query.sort){
        case "price-asc":
            sort={price:1}
            break;
        case "price-desc":
            sort={price:-1}
            break;
        case "newest":
            sort={createdAt:-1}
            break;
        case "oldest":
            sort={createdAt:1}
            break;
        default:
            sort={createdAt:-1}   
    }
    query.pageSize=pageSize
    const resultData=await findBooks(query,skip,filter ,sort)
    const totalCount=await getBooksCount(filter)
    const result={
        books:resultData,
       currentPage:query.currentPage?parseInt(String(query.currentPage)):1,
       pageSize:query.pageSize?query.pageSize:10,
       totalPage:Math.ceil(totalCount/(query.pageSize?query.pageSize:10)),
       totalCount
    }
    return result
}