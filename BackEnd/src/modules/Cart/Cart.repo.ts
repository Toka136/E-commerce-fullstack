import { ClientSession } from "mongoose"
import CartModal from "./Cart.modal"
import {  insertCartI } from "./Cart.types"
import bookModal from "../Books/book.modal"

export const findCartByUserId=async(userId:string,session?:ClientSession)=>{
    return await CartModal.findOne({userId}).session(session??null)
}
export const getCartByUserId=async(userId:string)=>{
        return await CartModal.findOne({userId}).populate({
            path:"items.product",
            select:"title coverImage price stock"
        })
}
export const insertCart=async(cart:insertCartI,session?:ClientSession)=>{
  console.log("cart",cart)
    const newCart=new CartModal({userId:cart.userId,items:[{product:cart.productId,quantity:1,priceAtPurchase:cart.price}],subtotal:cart.price},{session})
    // mongoose SaveOptions.session expects ClientSession | null (not undefined)
    return await newCart.save({session: session ?? null})
}
export const insertEmptyCart=async(userId:string)=>{
    const newCart=new CartModal({userId:userId,items:[],subtotal:0})
    return await newCart.save()
}
export const removeProductFromCart=async(userId:string,productId:string)=>{
    const cart=await findCartByUserId(userId)
    if(!cart){
        throw new Error("Cart Not Found")
    }
    const cartProduct=cart.items.find((item)=>item.product.toString()===productId)
    if(!cartProduct){
        throw new Error("Product Not Found")
    }
    return await CartModal.findOneAndUpdate(
        {userId},
        {
            $inc:{subtotal:-cartProduct.priceAtPurchase*cartProduct.quantity},
            $pull:{items:{product:productId}}
        },
        {new:true}
    )
}
export const removeCart=async(userId:string,session:ClientSession)=>{
    return await CartModal.findOneAndDelete({userId},{session})
}
export const updateQuantity = async (cartItem: insertCartI,stock:number) => {
  const existingCart = await findCartByUserId(cartItem.userId);

  if (!existingCart) {
    throw new Error("Cart not found");
  }


  const cartProduct = existingCart.items.find(
    (item) => item.product.toString() === cartItem.productId
  );

  if (!cartProduct) {
    throw new Error("Product not found in cart");
  }

  const newQuantity = Number(cartItem.quantity);

  if (!Number.isInteger(newQuantity) || newQuantity < 1) {
    throw new Error("Invalid quantity");
  }

  if (newQuantity > stock) {
    throw new Error("Not enough stock");
  }

  const oldQuantity = Number(cartProduct.quantity);
  const price = Number(cartItem.price);
  const subtotal = Number(existingCart.subtotal);

  cartProduct.quantity = newQuantity;

  existingCart.subtotal =
    subtotal -
    price * oldQuantity +
    price * newQuantity;

  return await existingCart.save();
};
export const addProductToCart = async (cartItem: insertCartI) => {
  const userId = cartItem.userId;
  const quantity = cartItem.quantity ?? 1;

  return await CartModal.findOneAndUpdate(
    { userId },
    {
      $push: {
        items: {
          product: cartItem.productId,
          quantity,
          priceAtPurchase: cartItem.price,
        },
      },
      $inc: {
        subtotal: cartItem.price * quantity,
      },
    },
    {
      new: true,
    }
  );
};