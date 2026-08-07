import jwt, { TokenExpiredError } from "jsonwebtoken"
import appError from "./errorClass"
import { responseStatus } from "./responseStatus"
import { CusomtJwtPayload } from "../modules/Auth/Auth.types"
export const GetUserInfo=(token:string)=>{
    try{
    const userInfo=jwt.verify(token,process.env.JWT_SECRET_KEY as string) as CusomtJwtPayload
    console.log("userInfo",userInfo)
   
    return userInfo
    }catch(err){
        if(err instanceof TokenExpiredError){
            throw new appError("Token Expired",401,responseStatus.FAILED)
        }
       throw new appError(
      "Invalid token",
      401,
      responseStatus.FAILED
    );
    }
}