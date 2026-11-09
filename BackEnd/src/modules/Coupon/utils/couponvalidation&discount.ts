import { Coupon, Prisma } from "../../../generated/prisma/client";

export const calculateCouponDiscount = (
  subtotal: Prisma.Decimal,
  coupon: Coupon
) => {
  let discountAmount = new Prisma.Decimal(coupon.discount);

  if (coupon.type === "PERCENTAGE") {
    discountAmount = subtotal
      .mul(coupon.discount)
      .div(100);
  }

  if (discountAmount.greaterThan(subtotal)) {
    discountAmount = subtotal;
  }

  discountAmount = discountAmount.toDecimalPlaces(2);

  const totalAfterCoupon = subtotal.sub(discountAmount);

  return {
    discountAmount,
    totalAfterCoupon,
  };
};
export const isCouponValidForCart = (
  coupon: Coupon,
  subtotal: Prisma.Decimal
) => {
  const now = new Date();

  if (!coupon.isActive) {
    return "Coupon is not active";
  }

  if (coupon.startDate > now) {
    return "Coupon is not available yet";
  }

  if (coupon.endDate < now) {
    return "Coupon is expired";
  }

  const isAmountValid =
    subtotal.greaterThanOrEqualTo(coupon.minAmount) &&
    (
      coupon.maxAmount.equals(0) ||
      subtotal.lessThanOrEqualTo(coupon.maxAmount)
    );

  if (!isAmountValid) {
    return "Invalid Cart Amount";
  }

  if (coupon.useCount >= coupon.maxUses) {
    return "Coupon usage limit reached";
  }

  return "";
};