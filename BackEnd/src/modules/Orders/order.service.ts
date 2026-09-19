import { ObjectId } from "mongodb"
import { GetUserInfo } from "../../utils/userInfo"
import { getCartByUserId, removeCart, removeProductFromCart } from "../Cart/Cart.repo"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { findOrderBooks, updateStock } from "../Books/book.repo"
import { bookI } from "../Books/book.types"
import { orderI, orderItemI, shippingAddress } from "./order.types"
import { createOrder, findOrderById, getOrders, getOrdersByUserId, updateOrderPaymentStatus, updateOrderStatus } from "./order.repo"
import mongoose from "mongoose"

export const createOrderS=async(id:string,address:shippingAddress,paymentMethod:"cash"|"online")=>{
   
    const cart =await getCartByUserId(id)
    if(!cart){
        throw new appError("Cart Not Found",400,responseStatus.FAILED)
    }
    if (cart.items.length === 0) {
    throw new appError("Cart is empty", 400, responseStatus.FAILED);
}   
    const session=await mongoose.startSession()
    try{
        session.startTransaction()
        const books:bookI[]=await findOrderBooks(cart.items.map((item)=>item.product._id.toString()),session)
        let totalPrice=0
        let orderItmes:orderItemI[]=[]
        for(const item of cart.items){
        let book= await checkQuantity(books,item.product._id.toString(),item.quantity,id)   
        totalPrice+=book.price*item.quantity
        orderItmes.push({
            book:item.product._id,
            quantity:item.quantity,
            priceAtPurchase:book.price,
            titleAtPurchase:book.title,
            imageAtPurchase:book.coverImage
        })
      }
        const newOrder:orderI={
        userId:new ObjectId(id),
        items:orderItmes,
        totalPrice:totalPrice,
        paymentMethod:paymentMethod,
        paymentStatus:"pending",
        orderStatus:"pending",
        shippingAddress:address,
    }
    const res =await createOrder(newOrder,session)
     for (const item of cart.items) {
     await updateStock(item.product._id.toString(),item.quantity,session)
     }
   
    await removeCart(id,session)
    await session.commitTransaction();
    return res
    }catch(err){
        console.log(err)
        await session.abortTransaction()
        if(err instanceof appError){
            throw err
        }
        throw new appError("Error in database",500,responseStatus.FAILED)
    }finally{
        await session.endSession()
    }  
      
}
export const checkQuantity=async(books:bookI[],bookId:string,quantity:number,id:string)=>{
    const book=books.find((book)=>book._id!.toString()===bookId)
    console.log("book")
    if(!book){
        console.log("bookId");
// console.log(typeof bookId);
         await removeProductFromCart(id,bookId)
        throw new appError("Book Not Found",400,responseStatus.FAILED)
    }
    if(book.stock<quantity){
        // console.log("book.stock",book.stock,"quantity",quantity);
        throw new appError("not enough stock",400,responseStatus.FAILED)
    }
    console.log("book.stock",book.stock,"quantity",quantity);
    return book
}
export const getOrdersS=async(id:string,role:string)=>{
  
    if(role==="admin"){
        const orders=getOrders()
         return orders
        }
   const orders=await getOrdersByUserId(id)
   return orders
  
}
export const changeOrderStatusS=async(id:string,status:string)=>{
    const order=await findOrderById(id)
    if(!order){
        throw new appError("Order Not Found",400,responseStatus.FAILED)
    }
    if(status==="delivered"){
        await updateOrderPaymentStatus(id,"completed")
   
  }
  else if(status==="cancelled"){
    await updateOrderPaymentStatus(id,"failed")
  }
 await updateOrderStatus(id,status)
    return findOrderById(id)
}
export const getOrderS=async(id:string,userId:string,role:string)=>{
   
    if(role==="admin"){
        console.log("admin");
        return await findOrderById(id)
    }
    const order= await findOrderById(id)
    if(!order){
        throw new appError("Order Not Found",400,responseStatus.FAILED)
    }
    if(order.userId.toString()!==userId.toString()){
        throw new appError("You are not authorized to view this order",400,responseStatus.FAILED)
    }
    return order
}