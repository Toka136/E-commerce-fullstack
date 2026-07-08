import jwt from "jsonwebtoken"
import appError from "./errorClass"
import { responseStatus } from "./responseStatus"
import { CusomtJwtPayload } from "../modules/Auth/Auth.types"
export const GetUserInfo=(token:string)=>{
    const userInfo=jwt.verify(token,process.env.JWT_SECRET_KEY as string) as CusomtJwtPayload
    console.log("userInfo",userInfo)
    if(!userInfo){
        throw new appError("Invalid Token",400,responseStatus.FAILED)
    }
    return userInfo
}