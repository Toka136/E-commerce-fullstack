import { ObjectId } from "mongodb"
import { GetUserInfo } from "../../utils/userInfo"
import { addEmptyWishList, addBookW, addWishList, deleteBookW, getWishListByUserId, WHasBook } from "./WishList.repo"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import mongoose, { ClientSession } from "mongoose"
import { findBookById, findOnlyBookById } from "../Books/book.repo"
import { addProductInCart_S } from "../Cart/Cart.service"
import { findCartByUserId, insertCart } from "../Cart/Cart.repo"

export const getWishListS=async(userId:string)=>{
    const res =await getWishListByUserId(userId)
    if(!res){
        const newWishList=await addEmptyWishList(userId)
        return newWishList
    }
    return res
}
export const addBookWishListS=async(userId:string,bookId:string)=>{
  
    const wishList=await getWishListByUserId(userId)
    const hasBook=await WHasBook(userId,bookId)
     if(!wishList){
     await addWishList(userId,[bookId])
     return bookId
    }
    if(hasBook){
        return hasBook.id
    }
   
    await addBookW(bookId,userId)     
    return bookId

}
export const deleteBookWS=async(userId:string,bookId:string)=>{
    await deleteBookW(userId,bookId)
    return bookId
}

// export const moveToCartS = async (
//   userId: string,
//   bookId: string
// ) => {
  

//   return prisma.$transaction(async (tx) => {
//     // 1. Check wishlist
//     const wishList = await getWishListByUserId(userId, tx);

//     if (!wishList) {
//       throw new appError(
//         "WishList Not Found",
//         404,
//         responseStatus.FAILED
//       );
//     }

//     // 2. Check book in wishlist
//     const hasBook = await WHasBook(
//       userId,
//       bookId,
//       tx
//     );

//     if (!hasBook) {
//       throw new appError(
//         "book Not Found In Wishlist",
//         404,
//         responseStatus.FAILED
//       );
//     }

//     // 3. Get book
//     const book = await findOnlyBookById(bookId, tx);

//     if (!book) {
//       throw new appError(
//         "book Not Found",
//         404,
//         responseStatus.FAILED
//       );
//     }

//     if (book.stock <= 0) {
//       throw new appError(
//         "Book Out Of Stock",
//         400,
//         responseStatus.FAILED
//       );
//     }

//     // 4. Add Book to cart
//     // await addBookIntoCartW_S(
//     //   userId,
//     //   bookId,
//     //   book.price,
//     //   tx
//     // );

//     // 5. Remove Book from wishlist
//     await deleteBookW(
//       userId,
//       bookId,
//       tx
//     );

//     return bookId;
//   });
// };
// export const addBookIntoCartW_S = async (
//   userId: string,
//   productId: string,
//   price: number,
//   session?: ClientSession,
  
// ) => {
//   const cart = await findCartByUserId(userId, session);
//   if (!cart) {
//     return await insertCart(
//       {
//         userId:userId,
//         productId:productId,
//         price:price
//       },
//       session
//     );
//   }

//   const item = cart.items.find(
//     (item) => item.product.toString() === productId
//   );

//   if (item) {
//     item.quantity++;
//     cart.subtotal += price;
//   } else {
//     cart.items.push({
//       product: productId,
//       quantity: 1,
//       priceAtPurchase: price,
//     });
//     cart.subtotal += price;
//   }

// if (session) {
//   await cart.save({ session });
// } else {
//   await cart.save();
// }
//   return cart;
// };
  