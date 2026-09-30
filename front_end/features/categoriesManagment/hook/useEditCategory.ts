import { toast } from "react-toastify";
import { editCategoryT } from "../types/categories";
import { useMutation } from "@tanstack/react-query";
import { EditCategory } from "../api/editCategory";
import { useRouter } from "next/navigation";

export const UseEditCategory = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: editCategoryT }) =>
      EditCategory(slug, data),
    onSuccess: () => {
      toast.success("Category updated successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to update category")
    }
  })
}
