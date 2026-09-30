import * as Yup from "yup";

export const addCategorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .required("Category name is required"),
    description:Yup.string().min(2, "Category name must be at least 2 characters").optional()
});