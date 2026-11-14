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
import { prisma } from "../../config/prisma";
import { recalculateCartCoupon } from "./helper/recalculateCartCoupon";

export const addProductInCart_S = async (
  { bookId, userId, quantity }: cartI,
  tx?: Prisma.TransactionClient
) => {
  const execute = async (transaction: Prisma.TransactionClient) => {
    const product = await findOnlyBookById(bookId, transaction);

    if (!product) {
      throw new appError("Product Not Found", 404, responseStatus.FAILED);
    }

    const newQuantity = quantity ?? 1;

    if (newQuantity < 1) {
      throw new appError("Invalid Quantity", 400, responseStatus.FAILED);
    }

    const existingCart = await getCartByUserId(userId, transaction);

    // No cart exists: create a new cart
    if (!existingCart) {
      if (newQuantity > product.stock) {
        throw new appError("Out of Stock", 400, responseStatus.FAILED);
      }

      const newCart = await insertCart(
        {
          userId,
          bookId,
          quantity: newQuantity,
          price: product.price,
        },
        transaction
      );

      return { cart: newCart };
    }

    const cartItem = existingCart.items.find(
      (item) => item.book.id === bookId
    );

    let updatedCart;

    // Product already exists: update quantity
    if (cartItem) {
      const totalQuantity = cartItem.quantity + newQuantity;

      if (totalQuantity > product.stock) {
        throw new appError("Out of Stock", 400, responseStatus.FAILED);
      }

      updatedCart = await updateQuantity(
        {
          userId,
          bookId,
          quantity: totalQuantity,
          price: product.price,
        },
        transaction
      );
    } else {
      // Product doesn't exist: add new item
      if (newQuantity > product.stock) {
        throw new appError("Out of Stock", 400, responseStatus.FAILED);
      }

      updatedCart = await addProductToCart(
        {
          userId,
          bookId,
          quantity: newQuantity,
          price: product.price,
        },
        transaction
      );
    }

   const couponResult = await recalculateCartCoupon(
      userId,
      existingCart.couponId,
      updatedCart.subtotal,
      transaction
    );

   return {
    message: "Cart updated successfully",
    ...couponResult,
    };
  };

  if (tx) {
    return execute(tx);
  }

  return prisma.$transaction(async (transaction) => {
    return execute(transaction);
  });
};
export const getCartS=async(userId:string)=>{
    
    const cart=await getCartByUserId(userId)
    if(!cart){
       const newCart=await insertEmptyCart(userId)
       return newCart
    }
    return cart
}
export const removeProductFromCartS = async (
  { bookId, userId }: cartI,
  tx?: Prisma.TransactionClient
) => {
  const execute = async (transaction: Prisma.TransactionClient) => {
    const existingCart = await getCartByUserId(userId, transaction);

    if (!existingCart) {
      throw new appError("Cart Not Found", 404, responseStatus.FAILED);
    }

    // Remove product and recalculate subtotal
    const updatedCart = await removeProductFromCart(
      userId,
      bookId,
      transaction
    );
    const couponResult = await recalculateCartCoupon(
      userId,
      existingCart.couponId,
      updatedCart.subtotal,
      transaction
    );

    return couponResult ?? { cart: updatedCart };
     
  };

  if (tx) {
    return execute(tx);
  }

  return prisma.$transaction(async (transaction) => {
    return execute(transaction);
  });
};
export const updateCart_S = async (
  { bookId, userId, quantity }: cartI,
  tx?: Prisma.TransactionClient
) => {
  const execute = async (transaction: Prisma.TransactionClient) => {
    const existingCart = await getCartByUserId(userId, transaction);

    if (!existingCart) {
      throw new appError("Cart Not Found", 404, responseStatus.FAILED);
    }

    const product = await findOnlyBookById(bookId, transaction);

    if (!product) {
      throw new appError("Product Not Found", 404, responseStatus.FAILED);
    }

    const newQuantity = quantity ?? 1;

    if (newQuantity < 1) {
      throw new appError("Invalid Quantity", 400, responseStatus.FAILED);
    }

    const updatedCart = await updateQuantity(
      {
        userId,
        bookId,
        quantity: newQuantity,
        price: product.price,
      },
      transaction
    );

    const couponResult = await recalculateCartCoupon(
      userId,
      existingCart.couponId,
      updatedCart.subtotal,
      transaction
    );

    return couponResult ?? { cart: updatedCart };
  };

  if (tx) {
    return execute(tx);
  }

  return prisma.$transaction(async (transaction) => {
    return execute(transaction);
  });
};
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
    if(usageCount?.usageCount??0 >= coupon.maxUsesPerUser)
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
