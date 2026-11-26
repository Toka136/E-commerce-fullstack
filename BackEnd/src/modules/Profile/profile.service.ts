import cloudinary from "../../config/cloudinaryconfig"
import { uploadToCloudinary } from "../../utils/uploadToCloudinary"
import { getOrdersCountByUserId } from "../Orders/order.repo"
import { getWishListItemsCount } from "../Wishlist/WishList.repo"
import { getUserProfile, updateUserProfile } from "./profile.repo"
import { updateProfileI } from "./profile.types"
import fs from "fs"
export const getUserProfileS=async(userId:string)=>{
    const wishListItemsCount=await getWishListItemsCount(userId)
    const ordersCount=await getOrdersCountByUserId(userId)
    const profile= await getUserProfile(userId)
    return {...profile,ordersCount,wishListItemsCount}
}
export const updateUserProfileS=async(userId:string,updateData:updateProfileI,file?:Express.Multer.File)=>{
  
    if(file){
        const user=await getUserProfile(userId)
        console.log("user",user)
        const oldImage=user?.imagePublicId
        console.log("old images",oldImage)
         const result=await uploadToCloudinary(file.buffer,"products")
        updateData.image=result.secure_url
        updateData.imagePublicId=result.public_id
        if(oldImage)
         await cloudinary.uploader.destroy(
                oldImage
              );
        const filename=file.filename;
       
    }
    return await updateUserProfile(userId,updateData)
}