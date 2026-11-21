import { CouponInput, CouponUpdate } from "../types/coupons";
import { api } from "@/axios/api";

export const addCoupon = async (data: CouponInput) => {
  const res = await api.post("coupon/addCoupon", data);
  return res.data;
};

export const editCoupon = async (id: string, data: CouponUpdate) => {
  const res = await api.patch(`coupon/editCoupon/${id}`, data);
  return res.data;
};



export const activateCoupon = async (id: string) => {
  const res = await api.patch(`coupon/activateCoupon/${id}`);
  return res.data;
};

export const deactivateCoupon = async (id: string) => {
  const res = await api.patch(`coupon/deactivateCoupon/${id}`);
  return res.data;
};

export const deleteCoupon = async (id: string) => {
  const res = await api.delete(`coupon/deleteCoupon/${id}`);
  return res.data;
};
