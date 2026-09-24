'use client'
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { sendResetLink } from "../api/passwordApi";
import { forgotPasswordInputT } from "../types/passwordType";

export const useForgotPassword = () => {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: forgotPasswordInputT) => sendResetLink(data),
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return { handleForgotPassword: mutate, isPending, isSuccess };
};