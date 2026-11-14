import appError from "../../../utils/errorClass"
import { responseStatus } from "../../../utils/responseStatus"
import { bookI } from "../../Books/book.types"
import { removeProductFromCart } from "../../Cart/Cart.repo"

export const checkQuantity=async(books:bookI[],bookId:string,quantity:number,id:string)=>{
    const book=books.find((book)=>book.id===bookId)
    if(!book){
     
         await removeProductFromCart(id,bookId)
        throw new appError("Book Not Found",400,responseStatus.FAILED)
    }
    if(book.stock<quantity){
        throw new appError("not enough stock",400,responseStatus.FAILED)
    }
    return book
}