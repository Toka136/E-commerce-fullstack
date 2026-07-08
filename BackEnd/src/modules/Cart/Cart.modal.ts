import mongoose from "mongoose";

const cartSchem=new mongoose.Schema({
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   items:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Book",
            required:true
        },
        quantity:{
            type:Number,
            default:1,
            min:1
        } 
    }
   ]
})
export default mongoose.model("Cart",cartSchem)