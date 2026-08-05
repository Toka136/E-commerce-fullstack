import mongoose from "mongoose";
const wishListSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   items:[{
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required:true
    }
   
   }],
   createdAt:{
    type:Date,
    default:Date.now
   },
   updatedAt:{
    type:Date,
    default:Date.now
   }
    
})
export default mongoose.model("WishList",wishListSchema)