import { cartI } from "./Cart.types";
import { GetUserInfo } from "../../utils/userInfo";
import {  addProductToCart, getCartByUserId, insertCart, insertEmptyCart, removeProductFromCart, updateQuantity } from "./Cart.repo";
import { ObjectId } from "mongodb";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { findBookById, findOnlyBookById } from "../Books/book.repo";
import { Prisma } from "../../generated/prisma/client";

export const addProductInCart_S=async({bookId,userId,quantity}:cartI,tx?:Prisma.TransactionClient)=>{
    
    const product = await findOnlyBookById(bookId,tx);
    const newQuantity=quantity??1
    if (!product) {
        throw new appError("Product Not Found", 404, responseStatus.FAILED);
    }
   
    const cart=await getCartByUserId(userId,tx);
    if(!cart)
    {
         if(newQuantity>product.stock)
    {
        throw new appError("Out of Stock", 400, responseStatus.FAILED);
    }
        const newCart=await insertCart({userId:userId,bookId:bookId,quantity:newQuantity,price:product.price},tx)
        return newCart
    }
    const cartItem=cart.items.find((item)=>item.book.id.toString()===bookId)
    if(cartItem)
    {
        const totalQuantity=cartItem.quantity+newQuantity
         if(totalQuantity>product.stock)
    {
        throw new appError("Out of Stock", 400, responseStatus.FAILED);
    }
        return await updateQuantity({userId:userId,bookId:bookId,quantity:totalQuantity,price:product.price},tx)
    }
     if(newQuantity>product.stock)
    {
        throw new appError("Out of Stock", 400, responseStatus.FAILED);
    }
   return await addProductToCart({userId:userId,bookId:bookId,quantity:newQuantity,price:product.price},tx)
    
}
export const getCartS=async(userId:string)=>{
    
    const cart=await getCartByUserId(userId)
    if(!cart){
       const newCart=await insertEmptyCart(userId)
       return newCart
    }
    return cart
}
export const removeProductFromCartS=async({bookId,userId}:cartI)=>{
  
    const cart=removeProductFromCart(userId,bookId)
    return cart

}
export const updateCart_S=async({bookId,userId,quantity}:cartI,tx?:Prisma.TransactionClient)=>{
     const product = await findOnlyBookById(bookId,tx);
    const newQuantity=quantity??1
    if (!product) {
        throw new appError("Product Not Found", 404, responseStatus.FAILED);
    }
    const cart=await updateQuantity({userId:userId,bookId:bookId,quantity:newQuantity,price:product.price},tx)
    return cart
}
