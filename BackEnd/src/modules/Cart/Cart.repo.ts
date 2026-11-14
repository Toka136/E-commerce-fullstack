import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import {  insertCartI } from "./Cart.types"


// export const findCartByUserId=async(userId:string,tx:Prisma.TransactionClient=prisma)=>{
//   return await tx.cart.findUnique({where:{userId}})
// }
export const getCartByUserId = async (userId: string,tx:Prisma.TransactionClient=prisma) => {
  return tx.cart.findUnique({
    where: { userId },
    include: {
      items: {
        select: {
          id: true,
          priceAtPurchase: true,
          quantity: true,
          book: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              price: true,
              stock: true,
            },
          },
        },
      },
      coupon:{
        select:{
          code:true
        }
      }
    },
  });
};
export const insertCart=async(cart:insertCartI,tx:Prisma.TransactionClient=prisma)=>{
  const newCart = await tx.cart.create({
  data: {
    userId: cart.userId,
    items: {
      create: {
        book: {
          connect: { id: cart.bookId },
        },
        quantity: 1,
        priceAtPurchase: cart.price,
      },
    },
    subtotal: cart.price,
  },
  include: {
    items: true,
  },
 
});
  return newCart
}
export const insertEmptyCart=async(userId:string)=>{
  const newCart=await prisma.cart.create({
    data:{
      userId:userId,
      items:{},
      subtotal:0
    }
  })
    return  newCart
}
export const removeProductFromCart=async(userId:string,bookId:string,tx:Prisma.TransactionClient=prisma)=>{
    const cart=await tx.cart.findUnique({
      where:{userId},
      select :{
        id:true,
        items:{
           where: {  bookId },
          select:{
            id:true,
            priceAtPurchase:true,
            quantity:true
          }
        },
        subtotal:true
      }
    })
    const cartItem=cart?.items[0]
    if(!cartItem||!cart)
    {
      throw new Error("Product Not Found")
    }
    const itemTotal=cartItem.priceAtPurchase.mul(cartItem.quantity)
    const newSubtotal=cart.subtotal.sub(itemTotal)
    await tx.cartItem.delete({where:{id:cartItem.id}})
    return await tx.cart.update({
      where:{id:cart.id},
      data:{subtotal:newSubtotal},
      select:{id:true,subtotal:true}
    })
    
  
}

export const removeCart=async(userId:string,tx:Prisma.TransactionClient=prisma)=>{
    return await tx.cart.delete({where:{userId}})
}
export const updateQuantity = async (
  newCartItem: insertCartI,
  tx: Prisma.TransactionClient = prisma
) => {
  const cart = await tx.cart.findUnique({
    where: { userId: newCartItem.userId },
    select: {
      id: true,
      subtotal: true,
      items: {
        where: { bookId: newCartItem.bookId },
        select: {
          id: true,
          priceAtPurchase: true,
          quantity: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart Not Found");
  }

  const cartItem = cart.items[0];

  if (!cartItem) {
    throw new Error("Product Not Found");
  }

  const quantity = newCartItem.quantity!;

  const oldItemTotal = cartItem.priceAtPurchase.mul(cartItem.quantity);

  const newItemTotal = newCartItem.price.mul(quantity);

  const newSubtotal = cart.subtotal
    .sub(oldItemTotal)
    .plus(newItemTotal);

  await tx.cartItem.update({
    where: { id: cartItem.id },
    data: {
      quantity,
      priceAtPurchase: newCartItem.price,
    },
  });

  return await tx.cart.update({
    where: { id: cart.id },
    data: { subtotal: newSubtotal },
    select: {
      id: true,
      subtotal: true,
    },
  });
};
 export const addProductToCart = async (cartItem: insertCartI,tx:Prisma.TransactionClient=prisma) => {
  return tx.cart.update({
    where: { userId: cartItem.userId },
    data: {
      items: {
        create: {
          book: {
            connect: {
              id: cartItem.bookId,
            },
          },
          quantity: cartItem.quantity!,
          priceAtPurchase: cartItem.price,
        },
      },
      subtotal: {
        increment: cartItem.price.mul(cartItem.quantity!),
      },
    },
  select: {
    id: true,
    subtotal: true,
  },
  })

 };
 export const addCouponToCart=async(userId:string,couponId:string,discountAmount:Prisma.Decimal,totalAfterCoupon:Prisma.Decimal,tx:Prisma.TransactionClient=prisma)=>{
  return await tx.cart.update({
    where:{userId},
    data:{couponId:couponId,discountAmount:discountAmount,totalAfterCoupon:totalAfterCoupon}
  })
 }
  export const removeCouponFromCart=async(userId:string,totalAfterCoupon:Prisma.Decimal,tx:Prisma.TransactionClient=prisma)=>{
  return await tx.cart.update({
    where:{userId},
    data:{couponId:null,discountAmount:0,totalAfterCoupon}
  })
 }