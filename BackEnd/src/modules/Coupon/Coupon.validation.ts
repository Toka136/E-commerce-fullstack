import * as z from "zod";

export const addCouponSchema = z
  .object({
    code: z.string().min(3),
    type: z.enum(["FIXED", "PERCENTAGE"]).optional().default("FIXED"),
    discount: z.number().min(1),
    minAmount: z.number().min(1).optional(),
    maxAmount: z.number().min(1).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    maxUsesPerUser: z.number().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "PERCENTAGE" && data.discount > 90) {
      ctx.addIssue({
        code: "custom",
        path: ["discount"],
        message: "Percentage discount cannot exceed 90%",
      });
    }

    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  });
//   =====================================================
export const editCouponSchema = z
  .object({
    type: z.enum(["FIXED", "PERCENTAGE"]).optional(),
    discount: z.number().min(1).optional(),
    minAmount: z.number().min(1).optional(),
    maxAmount: z.number().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    maxUsesPerUser: z.number().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one field must be provided" }
  );