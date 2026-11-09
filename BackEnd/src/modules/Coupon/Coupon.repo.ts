import {prisma} from "../../config/prisma"
import { addCouponParams, editCouponParams } from "./Coupon.types"
export const addCoupon=async(coupon:addCouponParams)=>{
    return await prisma.coupon.create({data:coupon})
}
export const getCouponByCode=async(code:string)=>{
    return await prisma.coupon.findUnique({where:{code}})
}
export const getCouponById=async(couponId:string)=>{
    return await prisma.coupon.findUnique({where:{id:couponId}})
}
export const getCoupons=async()=>{
    return await prisma.coupon.findMany()
}
export const editCoupon=async(couponId:string,coupon:editCouponParams)=>{
    return await prisma.coupon.update({where:{id:couponId},data:coupon})
    
}
export const deleteCoupon=async(couponId:string)=>{
    return await prisma.coupon.delete({where:{id:couponId}})
}
export const deactivateCoupon=async(couponId:string)=>{
    return await prisma.coupon.update({where:{id:couponId},data:{isActive:false}})
}
export const activateCoupon=async(couponId:string)=>{
    return await prisma.coupon.update({where:{id:couponId},data:{isActive:true}})
}
