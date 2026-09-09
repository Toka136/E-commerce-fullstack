import { api } from "@/axios/api"
import { editCategoryT } from "../types/categories"

export const EditCategory = async (slug: string, data: editCategoryT) => {
  const res = await api.patch(`category/updateCategory/${slug}`, data)
  return res.data
}
