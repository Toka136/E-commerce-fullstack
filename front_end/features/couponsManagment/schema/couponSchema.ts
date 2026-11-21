import * as Yup from "yup";

const dateRangeRules = {
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string()
    .required("End date is required")
    .test("after-start", "End date must be after start date", function (value) {
      const { startDate } = this.parent;
      return !value || !startDate || new Date(value) > new Date(startDate);
    }),
  minAmount: Yup.number().min(0, "Minimum amount cannot be negative").optional(),
  maxAmount: Yup.number()
    .min(0, "Maximum amount cannot be negative")
    .test("above-min", "Maximum amount cannot be less than minimum amount", function (value) {
      const { minAmount } = this.parent;
      return value == null || minAmount == null || value >= minAmount;
    })
    .optional(),
};

export const addCouponSchema = Yup.object({
  code: Yup.string().trim().min(3, "Code must be at least 3 characters").required("Code is required"),
  type: Yup.mixed<"FIXED" | "PERCENTAGE">().oneOf(["FIXED", "PERCENTAGE"]).default("FIXED"),
  discount: Yup.number()
    .typeError("Discount must be a number")
    .min(1, "Discount must be at least 1")
    .when("type", {
      is: "PERCENTAGE",
      then: (schema) => schema.max(90, "Percentage discount cannot exceed 90%"),
    })
    .required("Discount is required"),
  ...dateRangeRules,
  maxUsesPerUser: Yup.number().integer().min(1).optional(),
  isActive: Yup.boolean().optional(),
});

export const editCouponSchema = Yup.object({
  type: Yup.mixed<"FIXED" | "PERCENTAGE">().oneOf(["FIXED", "PERCENTAGE"]).optional(),
  discount: Yup.number()
    .typeError("Discount must be a number")
    .min(1, "Discount must be at least 1")
    .when("type", {
      is: "PERCENTAGE",
      then: (schema) => schema.max(90, "Percentage discount cannot exceed 90%"),
    })
    .optional(),
  startDate: Yup.string().optional(),
  endDate: Yup.string().optional(),
  minAmount: Yup.number().min(0, "Minimum amount cannot be negative").optional(),
  maxAmount: Yup.number()
    .min(0, "Maximum amount cannot be negative")
    .test("above-min", "Maximum amount cannot be less than minimum amount", function (value) {
      const { minAmount } = this.parent;
      return value == null || minAmount == null || value >= minAmount;
    })
    .optional(),
  maxUsesPerUser: Yup.number().integer().min(1).optional(),
  isActive: Yup.boolean().optional(),
}).test("has-change", "At least one field must be provided", (value) =>
  Boolean(value && Object.keys(value).length),
);
