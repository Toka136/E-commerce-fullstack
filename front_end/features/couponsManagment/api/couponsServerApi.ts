import { apiServer } from "@/axios/apiServer";
import { CouponInput, CouponUpdate } from "../types/coupons";



export const getCouponByCode = async (code: string) => {
  const res = await apiServer.get(`coupon/getCoupon/${encodeURIComponent(code)}`);
  return res.data;
};

export const getCoupons = async () => {
  console.log("get coupons");
  const res = await apiServer.get("coupon/getCoupons");
  return res.data;
};


