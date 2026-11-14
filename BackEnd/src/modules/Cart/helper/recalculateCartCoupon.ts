import { Prisma } from "../../../generated/prisma/client";
import appError from "../../../utils/errorClass";
import { responseStatus } from "../../../utils/responseStatus";
import { getCouponById } from "../../Coupon/Coupon.repo";
import { calculateCouponDiscount, isCouponValidForCart } from "../../Coupon/utils/couponvalidation&discount";
import { getCouponUsageByUserIdAndCouponId } from "../../CouponUsage/CouponUsage.repo";
import { addCouponToCart, removeCouponFromCart } from "../Cart.repo";

export const recalculateCartCoupon = async (
  userId: string,
  couponId: string | null,
  subtotal: Prisma.Decimal,
  tx: Prisma.TransactionClient
) => {
  // No coupon applied
  if (!couponId) {
        return {
    couponRemoved: false,
    };
  }

  const cartCoupon = await getCouponById(couponId, tx);

  if (!cartCoupon) {
    throw new appError("Coupon Not Found", 404, responseStatus.FAILED);
  }
  
  // Validate coupon using the updated subtotal
  const errorMessage = isCouponValidForCart(cartCoupon, subtotal);
  
  if (errorMessage) {
     await removeCouponFromCart(userId, subtotal, tx);

    return {
  couponMessage: errorMessage,
  couponRemoved: true,
  };
  }
  const usageCount=await getCouponUsageByUserIdAndCouponId(userId,cartCoupon.id)
            if(usageCount?.usageCount??0 >= cartCoupon.maxUsesPerUser)
            {
               return{
                  couponMessage:"Coupon usage limit reached",
                  couponRemoved: true,
               }
            }

  // Recalculate discount
  const { discountAmount, totalAfterCoupon } =
    calculateCouponDiscount(subtotal, cartCoupon);

   await addCouponToCart(
    userId,
    cartCoupon.id,
    discountAmount,
    totalAfterCoupon,
    tx
  );
 return {
  couponRemoved: false,
};
};