import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { findBookByName, insertBook } from "./book.repo";
import { bookT } from "./book.types";

export const addBook_S=async(body:bookT,file?:Express.Multer.File)=>{  
    const {title,author,genre,price,description,stock}=body
    const oldBook=await findBookByName(title)
    if(oldBook){
        throw new appError("Book Already Exists",400,responseStatus.FAILED)
    }
       const newwBook={
        title,
        author,
        genre,
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