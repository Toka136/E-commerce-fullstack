import { Prisma } from "../../../generated/prisma/client";
import appError from "../../../utils/errorClass";
import { responseStatus } from "../../../utils/responseStatus";
import { getCouponById } from "../../Coupon/Coupon.repo";
import { calculateCouponDiscount, isCouponValidForCart } from "../../Coupon/utils/couponvalidation&discount";
import { getCouponUsageByUserIdAndCouponId } from "../../CouponUsage/CouponUsage.repo";

export const recalculateOrderCoupon = async (
  userId: string,
  couponId: string | null,
  subtotal: Prisma.Decimal,
  tx: Prisma.TransactionClient
): Promise<{
  discountAmount: Prisma.Decimal;
  totalAfterCoupon: Prisma.Decimal;
}> => {
  const noDiscount = {
    discountAmount: new Prisma.Decimal(0),
    totalAfterCoupon: subtotal,
  };

  if (!couponId) {
    return noDiscount;
  }

  const cartCoupon = await getCouponById(couponId, tx);

  if (!cartCoupon) {
    throw new appError(
      "Coupon Not Found",
      404,
      responseStatus.FAILED
    );
  }

  const errorMessage = isCouponValidForCart(cartCoupon, subtotal);

  if (errorMessage) {
    throw new appError(
      errorMessage,
      400,
      responseStatus.FAILED
    );
  }

  const usageCount = await getCouponUsageByUserIdAndCouponId(
    userId,
    cartCoupon.id,
    tx
  );

  if (usageCount?.usageCount??0 >= cartCoupon.maxUsesPerUser) {
    throw new appError(
      "Coupon usage limit reached",
      400,
      responseStatus.FAILED
    );
  }

  return calculateCouponDiscount(subtotal, cartCoupon);
};