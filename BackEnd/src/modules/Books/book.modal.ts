import mongoose from "mongoose";

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    rate:{
        average:{
            type:Number,
            default:0
        },
        count:{
            type:Number,
            default:0
        }
      
    }
    
})
export default mongoose.model("Book",bookSchema)