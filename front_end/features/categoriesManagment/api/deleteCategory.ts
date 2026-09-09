import { api } from "@/axios/api"

export const DeleteCategory = async (id: string) => {
  const res = await api.delete(`category/deleteCategory/${id}`)
  return res.data
}