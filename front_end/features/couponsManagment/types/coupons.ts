export type CouponType = "FIXED" | "PERCENTAGE";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  discount: number;
  minAmount?: number;
  maxAmount?: number;
  startDate: string;
  endDate: string;
  useCount: number;
  maxUsesPerUser?: number;
  isActive: boolean;
}

export interface CouponInput {
  code: string;
  type?: CouponType;
  discount: number;
  minAmount?: number;
  maxAmount?: number;
  startDate: string;
  endDate: string;
  maxUsesPerUser?: number;
  isActive?: boolean;
}

export type CouponUpdate = Partial<Omit<CouponInput, "code">>;

export interface CouponResponse<T> {
  status: string;
  message: string;
  data: T;
}

export type CouponsResponse = CouponResponse<Coupon[]>;
export type SingleCouponResponse = CouponResponse<Coupon>;
