import mongoose from "mongoose"
const UserSchema=new mongoose.Schema(
    {
        userName:{
            type:String,
            required:true

        },
        email:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true 
        }  ,
        role:{
            type:String,
          enum:["admin","user"],
          default:"user"
        },
        image:{
            type:String,
            default:""
        } ,
       lastActiveAt: { type: Date, default: Date.now },
    })
export default mongoose.model("User",UserSchema)