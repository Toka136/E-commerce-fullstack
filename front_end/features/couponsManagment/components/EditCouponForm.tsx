import { useFormik } from "formik";
import { editCouponSchema } from "../schema/couponSchema";
import { Coupon, CouponUpdate } from "../types/coupons";
import { UseEditCoupon } from "../hooks/useCouponMutations";
import { CouponFormFields, toIsoDate, toLocalDateTime } from "./CouponFormFields";

export function EditCouponForm({ coupon, handleClose }: { coupon: Coupon; handleClose: () => void }) {
  const { mutateAsync, isPending } = UseEditCoupon();
  const formik = useFormik<CouponUpdate>({
    initialValues: { type: coupon.type, discount: coupon.discount, minAmount: coupon.minAmount, maxAmount: coupon.maxAmount, startDate: toLocalDateTime(coupon.startDate), endDate: toLocalDateTime(coupon.endDate), maxUsesPerUser: coupon.maxUsesPerUser, isActive: coupon.isActive },
    validationSchema: editCouponSchema,
    onSubmit: async (values) => {
      const initial = formik.initialValues;
      const changed: Partial<Record<keyof CouponUpdate, unknown>> = {};
      (Object.keys(values) as (keyof CouponUpdate)[]).forEach((key) => {
        if (values[key] !== initial[key]) {
          const value = values[key];
          if (key === "startDate" || key === "endDate") {
            changed[key] = value ? toIsoDate(String(value)) : undefined;
          } else if (key === "minAmount" || key === "maxAmount" || key === "maxUsesPerUser" || key === "discount") {
            changed[key] = value === "" ? undefined : Number(value);
          } else if (key === "type" || key === "isActive") {
            changed[key] = value;
          }
        }
      });
      const data = changed as CouponUpdate;
      await mutateAsync({ id: coupon.id, data });
      handleClose();
    },
  });

  return <form onSubmit={formik.handleSubmit} className="flex-1 space-y-6 overflow-y-auto p-6">
    <p className="text-sm text-on-surface-variant">Editing <strong>{coupon.code}</strong></p>
    <CouponFormFields formik={formik} />
    <footer className="flex gap-4 border-t border-outline-variant/20 pt-5">
      <button type="button" onClick={handleClose} className="flex-1 rounded-xl px-6 py-3 font-semibold text-on-surface-variant hover:bg-surface-container-high">Cancel</button>
      <button type="submit" disabled={isPending || !formik.dirty} className="flex-1 rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{isPending ? "Saving..." : "Save Changes"}</button>
    </footer>
  </form>;
}
