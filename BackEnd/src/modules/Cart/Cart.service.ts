import { cartCouponI, cartI } from "./Cart.types";
import { GetUserInfo } from "../../utils/userInfo";
import {  addCouponToCart, addProductToCart, getCartByUserId, insertCart, insertEmptyCart, removeCouponFromCart, removeProductFromCart, updateQuantity } from "./Cart.repo";
import { ObjectId } from "mongodb";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { findBookById, findOnlyBookById } from "../Books/book.repo";
import { Prisma } from "../../generated/prisma/client";
import { getCouponByCode, getCouponById } from "../Coupon/Coupon.repo";
import { getCouponUsageByUserIdAndCouponId } from "../CouponUsage/CouponUsage.repo";
import { calculateCouponDiscount, isCouponValidForCart } from "../Coupon/utils/couponvalidation&discount";

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
export const addCouponToCartS=async({userId,couponCode}:cartCouponI)=>{
    const coupon=await getCouponByCode(couponCode)
    const cart=await getCartByUserId(userId)
    if(!coupon)
    {
        throw new appError("Coupon Not Found", 404, responseStatus.FAILED);
    }
    
    if(!cart)
    {
        throw new appError("Cart Not Found", 404, responseStatus.FAILED);
    }
    if(cart?.couponId)
    {
        throw new appError("Coupon Already Applied", 400, responseStatus.FAILED);
    }
     const errorMessage=isCouponValidForCart(coupon,cart.subtotal)
     if(errorMessage){
        throw new appError(errorMessage, 400, responseStatus.FAILED);
     }
    const usageCount=await getCouponUsageByUserIdAndCouponId(userId,coupon.id)
    if(usageCount >= coupon.maxUsesPerUser)
    {
        throw new appError("Coupon usage limit reached", 400, responseStatus.FAILED);
    }
   const {discountAmount,totalAfterCoupon}=calculateCouponDiscount(cart.subtotal,coupon)
    const newCart=await addCouponToCart(userId,coupon.id,discountAmount,totalAfterCoupon)
    return {
        cart:newCart,
    }
}
export const removeCouponFromCartS=async(userId:string)=>{
    const cart=await getCartByUserId(userId)
    if(!cart)
    {
        throw new appError("Cart Not Found", 404, responseStatus.FAILED);
    }
   
    const totalAfterCoupon=cart.subtotal

    const newCart=await removeCouponFromCart(userId,totalAfterCoupon)
    return {
        cart:newCart,
    }
}
