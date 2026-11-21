import { FormikProps } from "formik";
import { CouponInput, CouponUpdate } from "../types/coupons";

type CouponFormValues = CouponInput | CouponUpdate;

export function CouponFormFields<T extends CouponFormValues>({
  formik,
  includeCode = false,
}: {
  formik: FormikProps<T>;
  includeCode?: boolean;
}) {
  const field = (name: keyof T) => ({
    name: String(name),
    value: (formik.values[name] ?? "") as string | number,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
  });
  const error = (name: keyof T) =>
    formik.touched[name] && formik.errors[name] ? (
      <p className="text-sm text-error">{String(formik.errors[name])}</p>
    ) : null;
  const inputClass = "w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary";

  return (
    <div className="space-y-4">
      {includeCode && (
        <div className="space-y-1">
          <label className="text-sm font-semibold text-on-surface-variant" htmlFor="code">Coupon code</label>
          <input id="code" {...field("code" as keyof T)} className={inputClass} placeholder="SUMMER2026" />
          {error("code" as keyof T)}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-on-surface-variant" htmlFor="type">Discount type</label>
          <select id="type" {...field("type" as keyof T)} className={inputClass}>
            <option value="FIXED">Fixed amount</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-on-surface-variant" htmlFor="discount">Discount</label>
          <input id="discount" type="number" min="1" max={formik.values.type === "PERCENTAGE" ? 90 : undefined} {...field("discount" as keyof T)} className={inputClass} />
          {error("discount" as keyof T)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {(["minAmount", "maxAmount"] as const).map((name) => (
          <div className="space-y-1" key={name}>
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor={name}>{name === "minAmount" ? "Minimum cart amount" : "Maximum discount amount"}</label>
            <input id={name} type="number" min="0" {...field(name as keyof T)} className={inputClass} />
            {error(name as keyof T)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {(["startDate", "endDate"] as const).map((name) => (
          <div className="space-y-1" key={name}>
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor={name}>{name === "startDate" ? "Starts at" : "Ends at"}</label>
            <input id={name} type="datetime-local" {...field(name as keyof T)} className={inputClass} />
            {error(name as keyof T)}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-on-surface-variant" htmlFor="maxUsesPerUser">Maximum uses per user</label>
        <input id="maxUsesPerUser" type="number" min="1" {...field("maxUsesPerUser" as keyof T)} className={inputClass} />
        {error("maxUsesPerUser" as keyof T)}
      </div>
      {includeCode && (
        <label className="flex items-center gap-2 text-sm text-on-surface-variant">
          <input type="checkbox" name="isActive" checked={Boolean(formik.values.isActive)} onChange={formik.handleChange} />
          Active
        </label>
      )}
    </div>
  );
}

export const toLocalDateTime = (date: string) => {
  if (!date) return "";
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? "" : new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export const toIsoDate = (date: string) => date ? new Date(date).toISOString() : date;
