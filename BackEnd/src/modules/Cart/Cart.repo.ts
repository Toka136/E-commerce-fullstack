import { ClientSession } from "mongoose"
import CartModal from "./Cart.modal"
import {  insertCartI } from "./Cart.types"

export const findCartByUserId=async(userId:string)=>{
    return await CartModal.findOne({userId})
}
export const getCartByUserId=async(userId:string)=>{
        return await CartModal.findOne({userId}).populate({
            path:"items.product",
            select:"title coverImage price stock"
        })
}
export const insertCart=async(cart:insertCartI)=>{
    const newCart=new CartModal({userId:cart.userId,items:[{product:cart.productId,quantity:1}]})
    return await newCart.save()
}
export const insertEmptyCart=async(userId:string)=>{
    const newCart=new CartModal({userId:userId,items:[]})
    return await newCart.save()
}
export const removeProductFromCart=async(cart:insertCartI)=>{
    const userId=cart.userId
    return await CartModal.findOneAndUpdate(
        {userId},
        {$pull:{items:{product:cart.productId}}},
        {new:true}
    )
}
export const removeCart=async(userId:string,session:ClientSession)=>{
    return await CartModal.findOneAndDelete({userId},{session})
}