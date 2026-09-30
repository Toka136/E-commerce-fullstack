import { api } from "@/axios/api";
import { verifyEmailResponse } from "../types/verifyEmail";

export const verifyEmail = async (token: string): Promise<verifyEmailResponse> => {
  const res = await api.post("/auth/verify", { token });
  return res.data;
};