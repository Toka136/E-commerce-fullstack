import mongoose from "mongoose";

export const categorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    slug:{type:String,required:true},
})
export default mongoose.model("Category",categorySchema)