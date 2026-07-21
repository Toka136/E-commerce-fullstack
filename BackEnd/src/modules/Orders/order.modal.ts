import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[{
        book:ObjectId,
        quantity:Number,
        priceAtPurchase:Number,
        titleAtPurchase:String,
        imageAtPurchase:String
    }],
    totalPrice:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true,
        enum:["cash","online"]
    },
    paymentStatus:{
        type:String,
        required:true,
        enum:["pending","completed","failed"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    orderStatus:{
        type:String,
        required:true,
        enum:["pending","processing","shipped","delivered","cancelled"]
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
    shippingAddress: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      }

})
export default mongoose.model("Order",orderSchema)