import { cartI } from "./Cart.types";
import { GetUserInfo } from "../../utils/userInfo";
import {  findCartByUserId, getCartByUserId, insertCart, insertEmptyCart, removeProductFromCart } from "./Cart.repo";
import { ObjectId } from "mongodb";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";

export const addProductInCart_S=async({productId,token}:cartI)=>{
    const userInfo=await GetUserInfo(token)
    const userId=new ObjectId(userInfo.id).toString()
    console.log("userId in cart",userId)

    const cart=await findCartByUserId(userId)
    if(!cart)
    {
        const newCart=await insertCart({userId:userId,productId:productId})
        return newCart
    }
    if(cart.items.find((item)=>item.product.toString()===productId))
    {
        cart.items.find((item)=>item.product.toString()===productId)!.quantity++
        await cart.save()
        return cart
    }
    cart.items.push({product:productId,quantity:1})
    await cart.save()
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
    const cart=removeProductFromCart({userId:userId,productId:productId})
    return cart

}
export const decreaseQuantityS=async({productId,token}:cartI)=>{
    const userInfo=await GetUserInfo(token)
    const userId=new ObjectId(userInfo.id).toString()
    const cart=await findCartByUserId(userId)
    if(!cart){
        throw new appError("Cart Not Found",404,responseStatus.FAILED)
    }
    if( cart.items.find((item)=>item.product.toString()===productId)===undefined)
    {
        throw new appError("Product Not Found",404,responseStatus.FAILED)
    }
    if( cart.items.find((item)=>item.product.toString()===productId)!.quantity===1)
    {
        await removeProductFromCart({userId:userId,productId:productId})
        return cart
    }
    cart.items.find((item)=>item.product.toString()===productId)!.quantity--
    await cart.save()
    return cart
}