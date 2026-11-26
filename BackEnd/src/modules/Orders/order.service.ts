import { orderStatus, paymentMethod, Prisma } from "../../generated/prisma/client";
import { createFawaterakTransaction } from "../../services/fawaterak/fawaterak.service";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import {  findOnlyBookById, findOrderBooks, incrementStock, updateBook, updateStock } from "../Books/book.repo";
import { bookI } from "../Books/book.types";
import { getCartByUserId, removeCart } from "../Cart/Cart.repo";
import {  decrementCouponUses ,getCouponById, useCoupon } from "../Coupon/Coupon.repo";
import { addCouponUsage, decrementCouponUsage } from "../CouponUsage/CouponUsage.repo";
import { checkQuantity } from "./helper/checkQuantity";
import { recalculateOrderCoupon } from "./helper/recalculateOrderCoupon";
import { cancelOrder, createOrder, findOrderById, findOrderByIdempotencyKey, getOrders, getOrdersByUserId, updateOrderPaymentStatus, updateOrderStatus } from "./order.repo";
import { OrderI, OrderItemI, OrderWithRelations, ShippingAddressI } from "./order.types";
import {prisma} from "../../config/prisma"
import { createPayment, deletePayment, expirePayment, expirePendingPayments, findActivePendingPayment, getPaymentByOrderId } from "../Payment/Payment.repo";
import { paymentI } from "../Payment/Payment.type";
import { prepareFawaterakPayload } from "./helper/prepareFawaterakPayload";


export const createOrderWithoutPayS=async(id:string,idempotencyKey:string,address:ShippingAddressI,paymentMethod:paymentMethod,tx?:Prisma.TransactionClient)=>{
   const execute=async(transaction: Prisma.TransactionClient)=>{
    const existingOrder = await findOrderByIdempotencyKey(
      id,
      idempotencyKey,
      transaction
    );

    if (existingOrder) {
      return existingOrder;
    }
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
          idempotencyKey:idempotencyKey,
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
        couponCode:cart.coupon?.code??null,
        couponId: cart.couponId ?? null,
      }
      const createdOrder =await createOrder(newOrder,transaction)
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
    return createdOrder
      }
        
   
   
   try {
    if (tx) {
      return await execute(tx);
    }

    return await prisma.$transaction(async (transaction) => {
      return await execute(transaction);
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existingOrder = await findOrderByIdempotencyKey(
        id,
        idempotencyKey
      );

      if (existingOrder) {
        return existingOrder;
      }
    }

    throw error;
  }
    }
export const getOrdersS=async(id:string,role:string)=>{
  
    if(role==="ADMIN"){
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
    
    if(orderStatus.toLocaleUpperCase()==="DELIVERED"){
        await updateOrderPaymentStatus(id,"COMPLETED")
   
  }
 
 await updateOrderStatus(id,orderStatus.toLocaleUpperCase() as orderStatus)
    return await findOrderById(id)
}
export const getOrderS=async(id:string,userId:string,role:string)=>{
   
    if(role==="ADMIN"){
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
    const payment=await getPaymentByOrderId(order.id)
      return{
        order,
        payment
      }
  
}
export const cancelOrderS=async(id:string,tx?:Prisma.TransactionClient)=>{
    
    const execute=async(transaction: Prisma.TransactionClient)=>{
         const order=await findOrderById(id,transaction)
          if(!order){
        throw new appError("Order Not Found",400,responseStatus.FAILED)
    }
         if(order?.orderStatus==="CANCELLED"){
             throw new appError("Order is already cancelled",400,responseStatus.FAILED)
         }
         if(order?.orderStatus==="DELIVERED"){
             throw new appError("Order is already delivered",400,responseStatus.FAILED)
         }
   
    for(const item of order.orderItems){
        if(item.bookId!==null){    
            const book=await findOnlyBookById(item.bookId,transaction)
            if(book){
            await incrementStock(item.bookId,item.quantity,transaction)
            }
        }
    }
    if(order.couponId){
        await decrementCouponUses(order.couponId,transaction)
        const usage = await decrementCouponUsage(
        order.couponId,
        order.userId,
        transaction
        );
        if (usage.count === 0) {
        throw new appError(
            "Coupon usage record not found",
            400,
            responseStatus.FAILED
        );
        }
        
    }
    const result = await cancelOrder(id, transaction);

    if (result.count === 0) {
    throw new appError(
        "Order cannot be cancelled",
        400,
        responseStatus.FAILED
    );
    }
    return await findOrderById(id,transaction)
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
export const createOrderS = async (
  id: string,
  address: ShippingAddressI,
  paymentMethod: paymentMethod,
  idempotencyKey: string
) => {
  const order = await prisma.$transaction(async (tx) => {
    return await createOrderWithoutPayS(
      id,
      idempotencyKey,
      address,
      paymentMethod,
      tx
    );
  });

  return order;
};
export const payOrderS = async (
  orderId: string,
  paymentMethodNumber: number,
  userId: string
) => {
  const allowedPaymentMethods = [2, 3, 4];
  console.log("paymentMethodNumber", paymentMethodNumber);
if (!allowedPaymentMethods.includes(paymentMethodNumber)) {
  throw new appError(
    "Invalid payment method",
    400,
    responseStatus.FAILED
  );
}
  const order = await findOrderById(orderId);
  if(!order){
    throw new appError("Order Not Found",404,responseStatus.FAILED)
  }
  if(order.userId!==userId){
    throw new appError("You are not authorized to view this order",403,responseStatus.FAILED)
  }
  if(order.paymentMethod!=="ONLINE"){
    throw new appError("Payment method is not online",400,responseStatus.FAILED)
  }
  if(order.paymentStatus==="COMPLETED"){
    throw new appError("Order is already paid",400,responseStatus.FAILED)
  }
  if(order.orderStatus==="CANCELLED"){
    throw new appError("Order is already cancelled",400,responseStatus.FAILED)
  }
  if(order.orderStatus==="DELIVERED"){
    throw new appError("Order is already delivered",400,responseStatus.FAILED)
  }
 
  await expirePendingPayments(order.id);
 const existingPayment = await findActivePendingPayment(order.id);

if (existingPayment) {
  if (existingPayment.paymentMethod !== paymentMethodNumber) {
    throw new appError(
      "You already have an active payment attempt using another payment method",
      409,
      responseStatus.FAILED
    );
  }

  return existingPayment
}

  const payload = prepareFawaterakPayload(
    order,
    paymentMethodNumber
  );
  const result = await createFawaterakTransaction(payload);

  if (result.status !== "success") {
    throw new appError(
      "Failed to initiate payment",
      400,
      responseStatus.FAILED
    );
  }

  const paymentData: paymentI = {
    orderId: order.id,
    amount: order.totalPrice,
    provider: "FAWATERAK",
    paymentMethod: paymentMethodNumber,
    status: "PENDING",
    intentKey: result.data.intent_key,
  };

  if (
    "payment_data" in result.data &&
    "redirectTo" in result.data.payment_data
  ) {
    paymentData.paymentUrl =
      result.data.payment_data.redirectTo;
  }

    if (
    "payment_data" in result.data &&
    "systemReference" in result.data.payment_data
  ) {
    paymentData.systemReference = String(
      result.data.payment_data.systemReference
    );

    paymentData.isoQr = result.data.payment_data.isoQr;
  }

  
  const expireDate =  new Date(Date.now() + result.data.expires_in * 1000);

paymentData.expireDate = expireDate;
  console.log("Payment Data:", paymentData);
  const payment = await createPayment(paymentData);

  return payment
};