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
    genre:{
        type:String,
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
    }
    
})
export default mongoose.model("Book",bookSchema)