import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  activateCoupon,
  addCoupon,
  deactivateCoupon,
  deleteCoupon,
  editCoupon,
} from "../api/couponsClientApi";
import { CouponInput, CouponUpdate } from "../types/coupons";
import { useRouter } from "next/navigation";

const useCouponMutation = <TVariables,>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
  errorMessage: string,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      // toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      router.refresh()
    },
    onError: () => toast.error(errorMessage),
  });
};

export const UseAddCoupon = () =>
  useCouponMutation<CouponInput>(addCoupon, "Coupon added successfully", "Failed to add coupon");

export const UseEditCoupon = () =>
  useCouponMutation<{ id: string; data: CouponUpdate }>(
    ({ id, data }) => editCoupon(id, data),
    "Coupon updated successfully",
    "Failed to update coupon",
  );

export const UseActivateCoupon = () =>
  useCouponMutation<string>(activateCoupon, "Coupon activated successfully", "Failed to activate coupon");

export const UseDeactivateCoupon = () =>
  useCouponMutation<string>(deactivateCoupon, "Coupon deactivated successfully", "Failed to deactivate coupon");

export const UseDeleteCoupon = () =>
  useCouponMutation<string>(deleteCoupon, "Coupon deleted successfully", "Failed to delete coupon");
