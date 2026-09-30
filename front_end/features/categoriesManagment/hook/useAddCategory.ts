import { toast } from "react-toastify";
import { addCategoryT } from "../types/categories";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addCategory } from "@/features/categories/api/addCategory";
import { AddCategoryReq } from "@/features/categories/types/categories";

export const UseAddCategory = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: (data: AddCategoryReq) => addCategory(data),
    onSuccess: () => {
      toast.success("Category added successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to add category")
    }
  })
}
