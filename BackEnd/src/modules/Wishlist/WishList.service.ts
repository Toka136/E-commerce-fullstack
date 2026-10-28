import { ObjectId } from "mongodb"
import { GetUserInfo } from "../../utils/userInfo"
import { addEmptyWishList, addBookW, addWishList, deleteBookW, getWishListByUserId, WHasBook } from "./WishList.repo"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import mongoose, { ClientSession } from "mongoose"
import { findBookById, findOnlyBookById } from "../Books/book.repo"
import { addProductInCart_S } from "../Cart/Cart.service"
import { Prisma } from "../../generated/prisma/client"
import { getCartByUserId, insertCart } from "../Cart/Cart.repo"
import { prisma } from "../../config/prisma"
// import { findCartByUserId, insertCart } from "../Cart/Cart.repo"

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
   
     if(!wishList){
     await addWishList(userId,[bookId])
     return bookId
    }
     const hasBook=await WHasBook(userId,bookId)
    if(hasBook){
        return hasBook
    }
   
    await addBookW(bookId,userId)     
    return bookId

}
export const deleteBookWS=async(userId:string,bookId:string)=>{
    const wishList=await getWishListByUserId(userId)
    if(!wishList){
        throw new appError("WishList Not Found",404,responseStatus.FAILED)
    }
    const hasBook=await WHasBook(userId,bookId)
    if(!hasBook){
        throw new appError("book Not Found In Wishlist",404,responseStatus.FAILED)
    }
    await deleteBookW(userId,bookId)
    return bookId
}

export const moveToCartS = async (
  userId: string,
  bookId: string
) => {
  

  return prisma.$transaction(async (tx) => {
    // 1. Check wishlist
    const wishList = await getWishListByUserId(userId, tx);

    if (!wishList) {
      throw new appError(
        "WishList Not Found",
        404,
        responseStatus.FAILED
      );
    }

    // 2. Check book in wishlist
    const hasBook = await WHasBook(
      userId,
      bookId,
      tx
    );

    if (!hasBook) {
      throw new appError(
        "book Not Found In Wishlist",
        404,
        responseStatus.FAILED
      );
    }

    // 3. Get book
   

    // 4. Add Book to cart
    await addProductInCart_S({
      userId,
      bookId,
      quantity:1},
      tx
      
    );

    // 5. Remove Book from wishlist
    await deleteBookW(
      userId,
      bookId,
      tx
    );

    return bookId;
  });
};
