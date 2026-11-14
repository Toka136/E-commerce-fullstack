import { prisma } from "../../config/prisma";
import { orderStatus, paymentMethod, Prisma } from "../../generated/prisma/client";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { findOrderBooks, updateStock } from "../Books/book.repo";
import { bookI } from "../Books/book.types";
import { getCartByUserId, removeCart } from "../Cart/Cart.repo";
import { recalculateCartCoupon } from "../Cart/helper/recalculateCartCoupon";
import {  getCouponByCode, getCouponById, useCoupon } from "../Coupon/Coupon.repo";
import { addCouponUsage, getCouponUsageByUserIdAndCouponId } from "../CouponUsage/CouponUsage.repo";
import { checkQuantity } from "./helper/checkQuantity";
import { recalculateOrderCoupon } from "./helper/recalculateOrderCoupon";
import { createOrder, findOrderById, getOrders, getOrdersByUserId, updateOrderPaymentStatus, updateOrderStatus } from "./order.repo";
import { OrderI, OrderItemI, ShippingAddressI } from "./order.types";

export const createOrderS=async(id:string,address:ShippingAddressI,paymentMethod:paymentMethod,tx?:Prisma.TransactionClient)=>{
   const execute=async(transaction: Prisma.TransactionClient)=>{
        const cart =await getCartByUserId(id,transaction)
    if(!cart){
        throw new appError("Cart Not Found",400,responseStatus.FAILED)
    }
    if (cart.items.length === 0) {
    throw new appError("Cart is empty", 400, responseStatus.FAILED);
    }   
     const books:bookI[]=await findOrderBooks(cart.items.map((item)=>item.book.id),transaction)
     let totalPrice=new Prisma.Decimal(0)
     let orderItmes:OrderItemI[]=[]
      for(const item of cart.items){
        let book= await checkQuantity(books,item.book.id,item.quantity,id) 
          
        totalPrice=totalPrice.plus(book.price.mul(item.quantity))
        orderItmes.push({
            bookId:item.book.id,
            quantity:item.quantity,
            priceAtPurchase:new Prisma.Decimal(book.price),
            titleAtPurchase:book.title,
            imageAtPurchase:book.coverImage
        })
      }

            let couponResult:{totalAfterCoupon?:Prisma.Decimal,discountAmount?:Prisma.Decimal,couponRemoved?:boolean,couponMessage?:string}={}
        
        if(cart.couponId){
         couponResult=await recalculateOrderCoupon(id,cart.couponId,totalPrice,transaction)
        if (couponResult.couponRemoved){
            throw new appError(couponResult.couponMessage?? "Coupon is no longer valid",400,responseStatus.FAILED)
        }
    }
        let shippingPrice=new Prisma.Decimal(50)
        const discountAmount =couponResult.discountAmount ?? new Prisma.Decimal(0);
        const totalAfterCoupon = couponResult.totalAfterCoupon ?? totalPrice.sub(discountAmount);
        const newOrder:OrderI={
        userId:id,
        orderItems:orderItmes,
        totalPrice:totalAfterCoupon.plus(shippingPrice),
        paymentMethod:paymentMethod,
        paymentStatus:"PENDING",
        orderStatus:"PENDING",
        orderShippingAddress:address,
        discountAmount,
        shippingCost:shippingPrice,
        subtotal:totalPrice,
      }
      const res =await createOrder(newOrder,transaction)
     for (const item of cart.items) {
    const stockUpdated= await updateStock(item.book.id,item.quantity,transaction)
      if (!stockUpdated) {
    throw new appError(
      "Insufficient stock",
      400,
      responseStatus.FAILED
    );
  }
     }
     if(cart.couponId){
        const cartCoupon=await getCouponById(cart.couponId,transaction)
        if(!cartCoupon){
            throw new appError("Coupon Not Found",400,responseStatus.FAILED)
        }
         const couponUsed = await useCoupon(cart.couponId, transaction);

        if (!couponUsed) {
        throw new appError(
            "Coupon usage limit reached",
            400,
            responseStatus.FAILED
        );
        }
        const usageAdded = await addCouponUsage(
        cart.couponId,
        id,
        cartCoupon.maxUsesPerUser,
        transaction
        );

        if (!usageAdded) {
        throw new appError(
            "Coupon usage limit reached for this user",
            400,
            responseStatus.FAILED
        );
        }
     }

      await removeCart(id,transaction)
    return res
      }
        
   
   
   try {
    if (tx) {
      return await execute(tx);
    }

    return await prisma.$transaction(async (transaction) => {
      return await execute(transaction);
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    throw error;
  }
    }
export const getOrdersS=async(id:string,role:string)=>{
  
    if(role==="admin"){
        const orders=await getOrders()
         return orders
        }
   const orders=await getOrdersByUserId(id)
   return orders
  
}
export const changeOrderStatusS=async(id:string,orderStatus:orderStatus)=>{
    const order=await findOrderById(id)
    if(!order){
        throw new appError("Order Not Found",400,responseStatus.FAILED)
    }
    if(orderStatus==="DELIVERED"){
        await updateOrderPaymentStatus(id,"COMPLETED")
   
  }
 
 await updateOrderStatus(id,orderStatus)
    return await findOrderById(id)
}
export const getOrderS=async(id:string,userId:string,role:string)=>{
   
    if(role==="admin"){
        const order= await findOrderById(id)
         if(!order){
        throw new appError("Order Not Found",400,responseStatus.FAILED)
    }
        return order
    }
    const order= await findOrderById(id)
    if(!order){
        throw new appError("Order Not Found",400,responseStatus.FAILED)
    }
    if(order.userId!==userId){
        throw new appError("You are not authorized to view this order",400,responseStatus.FAILED)
    }
    return order
}