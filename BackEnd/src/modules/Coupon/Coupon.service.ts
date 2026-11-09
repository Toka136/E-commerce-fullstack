import { Prisma } from "../../generated/prisma/client"
import appError from "../../utils/errorClass"
import { responseStatus } from "../../utils/responseStatus"
import { activateCoupon, addCoupon, deactivateCoupon, deleteCoupon, editCoupon, getCouponByCode, getCouponById, getCoupons } from "./Coupon.repo"
import { addCouponParams, editCouponParams } from "./Coupon.types"

export const addCouponS=async(coupon:addCouponParams)=>{
    const existingCoupon=await getCouponByCode(coupon.code)
    if(existingCoupon){
       throw new appError("Coupon Already Exists",400,responseStatus.FAILED)
    }
    return await addCoupon(coupon)
}
export const getCouponS=async(code:string)=>{
    const coupon=await getCouponByCode(code)
    if(!coupon){
        throw new appError("Coupon Not Found",400,responseStatus.FAILED)
    }
    return coupon
}
export const getCouponsS=async()=>{
    const coupons=await getCoupons()
  
    return coupons
}
export const editCouponS=async(couponId:string,coupon:editCouponParams)=>{
    const existingCoupon=await getCouponById(couponId)
    if(!existingCoupon){
        throw new appError("Coupon Not Found",400,responseStatus.FAILED)
    }
    if(existingCoupon.useCount>0){
        throw new appError("Coupon Already Used please create a new one",400,responseStatus.FAILED)
    }
    const filteredCoupon = Object.fromEntries(
    Object.entries(coupon).filter(([_, value]) => value !== undefined)
    );

    const updatedCoupon = {
    ...existingCoupon,
    ...filteredCoupon
    };
    
  
   const discount = new Prisma.Decimal(updatedCoupon.discount);
    if (
    updatedCoupon.type === "PERCENTAGE" &&
      discount.greaterThan(90)
  ) {
    throw new appError(
      "Percentage discount cannot exceed 90%",
      400,
      responseStatus.FAILED
    );
  }

  // Date validation
  if (updatedCoupon.endDate <= updatedCoupon.startDate) {
    throw new appError(
      "End date must be after start date",
      400,
      responseStatus.FAILED
    );
  }
  const minAmount = new Prisma.Decimal(updatedCoupon.minAmount);
  const maxAmount = new Prisma.Decimal(updatedCoupon.maxAmount);
  if(maxAmount.lessThan(minAmount)) throw new appError("Max amount cannot be less than min amount",400,responseStatus.FAILED)

    return await editCoupon(couponId,coupon)
    
}
export const deleteCouponS=async(couponId:string)=>{
    const existingCoupon=await getCouponById(couponId)
    if(!existingCoupon){
        throw new appError("Coupon Not Found",400,responseStatus.FAILED)
    }
    if(existingCoupon.useCount>0){
        throw new appError("Coupon Already Used please deactivate it",400,responseStatus.FAILED)
    }
    return await deleteCoupon(couponId)
}
export const deactivateCouponS=async(couponId:string)=>{
    const existingCoupon=await getCouponById(couponId)
    if(!existingCoupon){
        throw new appError("Coupon Not Found",400,responseStatus.FAILED)
    }
     if (!existingCoupon.isActive) {
    throw new appError("Coupon Already Deactivated", 400, responseStatus.FAILED);
  }
    return await deactivateCoupon(couponId)
}
export const activateCouponS = async (couponId: string) => {
  const existingCoupon = await getCouponById(couponId);

  if (!existingCoupon) {
    throw new appError("Coupon Not Found", 404, responseStatus.FAILED);
  }

  if (existingCoupon.isActive) {
    throw new appError("Coupon Already Activated", 400, responseStatus.FAILED);
  }

  const now = new Date();

  if (existingCoupon.endDate <= now) {
    throw new appError("Coupon is expired", 400, responseStatus.FAILED);
  }

  if (existingCoupon.startDate > now) {
    throw new appError("Coupon is not available yet", 400, responseStatus.FAILED);
  }

  if (
    existingCoupon.maxUses !== null &&
    existingCoupon.useCount >= existingCoupon.maxUses
  ) {
    throw new appError("Coupon usage limit reached", 400, responseStatus.FAILED);
  }

  return await activateCoupon(couponId);
};