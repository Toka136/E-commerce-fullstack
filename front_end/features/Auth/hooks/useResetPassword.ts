'use client'
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { resetPassword } from "../api/passwordApi";
import { resetPasswordInputT } from "../types/passwordType";

export const useResetPassword = () => {
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: resetPasswordInputT) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successfully");
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return { handleResetPassword: mutate, isPending, isSuccess };
};