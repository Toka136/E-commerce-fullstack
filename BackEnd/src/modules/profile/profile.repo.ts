import userModel from "../Auth/user.model"
import { updateProfileI } from "./profile.types"

export const getUserProfile=async(userId:string)=>{
    return await userModel.findById(userId)
}
export const updateUserProfile=async(userId:string,updateData:updateProfileI)=>{
    return await userModel.findByIdAndUpdate(userId,updateData,{new:true})
}