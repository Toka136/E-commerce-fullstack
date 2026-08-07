import { cartI } from "./Cart.types";
import { GetUserInfo } from "../../utils/userInfo";
import {  addProductToCart, findCartByUserId, getCartByUserId, insertCart, insertEmptyCart, removeProductFromCart, updateQuantity } from "./Cart.repo";
import { ObjectId } from "mongodb";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { findBookById, findOnlyBookById } from "../Books/book.repo";

export const addProductInCart_S=async({productId,token,quantity}:cartI)=>{
    const userInfo=await GetUserInfo(token)
    const userId=new ObjectId(userInfo.id).toString()
    console.log("userId in cart",userId)
        const product = await findOnlyBookById(productId)
 if (!product) {
            throw new appError("Product Not Found", 404, responseStatus.FAILED);
        }
    const cart=await findCartByUserId(userId)
    console.log("quantity",quantity)
    if(!cart)
    {
        
       
        const newCart=await insertCart({userId:userId,productId:productId,quantity:quantity??1,price:product.price})
        return newCart
    }

    if(cart.items.find((item)=>item.product.toString()===productId))
    {
        await updateQuantity({userId:userId,productId:productId,quantity:quantity??1,price:product.price},product.stock)
        return cart
    }
   await addProductToCart({userId:userId,productId:productId,quantity:quantity??1,price:product.price})
    return cart
    
}
export const getCartS=async({token}:{token:string})=>{
    const userInfo=await GetUserInfo(token)
    const userId=new ObjectId(userInfo.id).toString()
    const cart=await getCartByUserId(userId)
    if(!cart){
       const newCart=await insertEmptyCart(userId)
       return newCart
    }
    return cart
}
export const removeProductFromCartS=async({productId,token}:cartI)=>{
    const userInfo=await GetUserInfo(token)
    const userId=new ObjectId(userInfo.id).toString()
    const cart=removeProductFromCart(userId,productId)
    return cart

}
