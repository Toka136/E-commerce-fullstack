import { NextFunction ,Request,Response} from "express";
import { AsyncFunction } from "../Types/middleWareType";
const Wrapper=(asyncFunction:AsyncFunction)=>{
    return(req:Request,res:Response,next:NextFunction)=>{
        try{
            asyncFunction(req,res,next)
        }catch(err){
            console.log(err)
            next(err)
        }
    }
}
export default  Wrapper