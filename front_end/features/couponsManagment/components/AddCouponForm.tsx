import { useFormik } from "formik";
import { addCouponSchema } from "../schema/couponSchema";
import { CouponInput } from "../types/coupons";
import { UseAddCoupon } from "../hooks/useCouponMutations";
import { CouponFormFields, toIsoDate } from "./CouponFormFields";

export function AddCouponForm({ handleClose }: { handleClose: () => void }) {
  const { mutateAsync, isPending } = UseAddCoupon();
  const formik = useFormik<CouponInput>({
    initialValues: { code: "", type: "FIXED", discount: 1, minAmount: undefined, maxAmount: undefined, startDate: "", endDate: "", maxUsesPerUser: undefined, isActive: true },
    validationSchema: addCouponSchema,
    onSubmit: async (values) => {
      await mutateAsync({ ...values, code: values.code.trim().toUpperCase(), startDate: toIsoDate(values.startDate), endDate: toIsoDate(values.endDate) });
      handleClose();
    },
  });

  return <form onSubmit={formik.handleSubmit} className="flex-1 space-y-6 overflow-y-auto p-6">
    <CouponFormFields formik={formik} includeCode />
    <footer className="flex gap-4 border-t border-outline-variant/20 pt-5">
      <button type="button" onClick={handleClose} className="flex-1 rounded-xl px-6 py-3 font-semibold text-on-surface-variant hover:bg-surface-container-high">Cancel</button>
      <button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{isPending ? "Saving..." : "Add Coupon"}</button>
    </footer>
  </form>;
}
