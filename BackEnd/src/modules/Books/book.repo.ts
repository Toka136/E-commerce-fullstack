import Book  from "./book.modal"
import { bookT } from "./book.types"
export const findBookByName=async(title:string)=>{
    return await Book.findOne({title})
}
export const insertBook=async(book:bookT)=>{
    const newBook=new Book(book)
     await newBook.save()
     return newBook
}