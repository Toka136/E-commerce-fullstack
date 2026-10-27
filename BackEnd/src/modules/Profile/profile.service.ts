import cloudinary from "../../config/cloudinaryconfig"
import { uploadToCloudinary } from "../../utils/uploadToCloudinary"
import { getUserProfile, updateUserProfile } from "./profile.repo"
import { updateProfileI } from "./profile.types"
import fs from "fs"
export const getUserProfileS=async(userId:string)=>{
    return await getUserProfile(userId)
}
export const updateUserProfileS=async(userId:string,updateData:updateProfileI,file?:Express.Multer.File)=>{
  
    if(file){
        const user=await getUserProfile(userId)
        console.log("user",user)
        const oldImage=user?.imagePublicId
        console.log("old images",oldImage)
        if(oldImage)
         await cloudinary.uploader.destroy(
                oldImage
              );
        const filename=file.filename;
        const result=await uploadToCloudinary(file.buffer,"products")
        updateData.image=result.secure_url
        updateData.imagePublicId=result.public_id
    }
    return await updateUserProfile(userId,updateData)
}