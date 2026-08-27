import { getUserProfile, updateUserProfile } from "./profile.repo"
import { updateProfileI } from "./profile.types"
import fs from "fs"
export const getUserProfileS=async(userId:string)=>{
    console.log("userId",userId)
    return await getUserProfile(userId)
}
export const updateUserProfileS=async(userId:string,updateData:updateProfileI,file?:Express.Multer.File)=>{
    console.log("updateData",updateData)
    console.log("userId",userId)
    if(file){
        const filename=file.filename;
        if(fs.existsSync(filename))
        fs.unlinkSync(filename)
        updateData.image=file.filename
    }
    return await updateUserProfile(userId,updateData)
}