import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})
export default mongoose.model("Review",reviewSchema)
