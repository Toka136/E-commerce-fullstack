'use client'
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Register } from "../api/registerApi";
import { registerInputT } from "../types/registerType";

export const useRegister = () => {
  const router = useRouter();

  const { mutate, mutateAsync, isPending, isError, error,isSuccess } = useMutation({
    mutationFn: (data: registerInputT) => Register(data),

    onSuccess: (res) => {
      console.log("res", res);
      toast.success("User Created Successfully");
      setTimeout(() => router.push("/login"), 2000);
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        toast.error(err.response?.data?.message ?? err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return {
    handleRegister: mutate, // fire-and-forget, same call style as before
    handleRegisterAsync: mutateAsync, // if you need to await it
    isPending, // use for disabling the submit button / showing a spinner
    isError,
    error,
    isSuccess
  };
};