import { useQuery } from "@tanstack/react-query";
import { getCouponByCode, getCoupons } from "../api/couponsServerApi";

export const UseCoupons = () =>
  useQuery({ queryKey: ["coupons"], queryFn: getCoupons });

export const UseCouponByCode = (code: string, enabled = true) =>
  useQuery({
    queryKey: ["coupons", code],
    queryFn: () => getCouponByCode(code),
    enabled: enabled && Boolean(code.trim()),
  });
