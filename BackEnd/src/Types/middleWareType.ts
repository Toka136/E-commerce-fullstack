import { NextFunction ,Request,Response} from "express";
import { ObjectId } from "mongodb";
export type AsyncFunction=(req:Request,res:Response,next:NextFunction)=>Promise<void>
export type userInfo={
    id:ObjectId,
    email:string,
    role:string
}
declare global {
  namespace Express {
    interface Request {
      user?: userInfo;
    }
  }
}

export {};