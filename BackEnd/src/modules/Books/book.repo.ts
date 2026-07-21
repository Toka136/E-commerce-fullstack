import { ClientSession } from "mongoose"
import Book  from "./book.modal"
import { bookI, editBookI, queryI } from "./book.types"
export const findBookByName=async(title:string)=>{
    return await Book.findOne({title})
}
export const insertBook=async(book:bookI)=>{
    const newBook=new Book(book)
     await newBook.save()
     return newBook
}
export const findBookById=async(id:string)=>{
    return await Book.findById(id)
}
export const updateBook=async(book:bookI,id:string)=>{
     const newbook=await Book.findByIdAndUpdate(id,book,{new:true})
     return newbook
}
export const deleteBook=async(id:string)=>{
    const result=await Book.deleteOne({_id:id})
    return result
}
export const findBooks=async(query:queryI,skip:number,filter:any)=>{
   
    return await Book.find(filter).limit(query.pageSize!).skip(skip)
}
export const getBooksCount=async(filter:any)=>{
    return await Book.countDocuments(filter)
}
export const findOrderBooks=async(orderBooksIds:string[],session:ClientSession)=>{
    return await Book.find({_id:{$in:orderBooksIds}},null,{session})
}
export const updateStock=async(bookId:string,quantity:number,session:ClientSession)=>{
    const result=await Book.findByIdAndUpdate(bookId,{$inc:{stock:-quantity}},{new:true,session})
    return result
}