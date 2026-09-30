import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { DeleteCategory } from "../api/deleteCategory";
import { useRouter } from "next/navigation";

export const UseDeleteCategory = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: (id: string) => DeleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to delete category")
    }
  })
}
