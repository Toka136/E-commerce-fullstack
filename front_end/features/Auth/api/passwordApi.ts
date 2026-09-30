import { api } from "@/axios/api";
import {
  forgotPasswordInputT,
  resetPasswordInputT,
  passwordResponse,
} from "../types/passwordType";

export const sendResetLink = async (data: forgotPasswordInputT): Promise<passwordResponse> => {
  const res = await api.post("/password/resetLink", data);
  return res.data;
};

export const resetPassword = async (data: resetPasswordInputT): Promise<passwordResponse> => {
  const res = await api.post("/password/resetPassword", data);
  return res.data;
};