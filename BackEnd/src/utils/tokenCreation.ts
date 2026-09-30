import jwt, { SignOptions } from "jsonwebtoken"
import { CusomtJwtPayload } from "../modules/Auth/Auth.types";
export const TokenCreation=(payload:CusomtJwtPayload, expiresIn?:SignOptions["expiresIn"])=>{
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined in the environment variables.");
    }
    const token=jwt.sign(payload,process.env.JWT_SECRET_KEY as string,{expiresIn:expiresIn?expiresIn:"1m"})
    return token
}