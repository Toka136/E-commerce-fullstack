import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
export interface UserData {
    userName: string;
    email: string;
    password: string;
   role?: string;
    image?: string
}
export interface loginBody {
    email: string;
    password: string;
}
export interface authResponse {
    newUser:UserData
    accessToken:string,
    refreshToken:string
}

export interface CusomtJwtPayload extends JwtPayload {
  email: string;
  id: ObjectId;
  role:string;
}