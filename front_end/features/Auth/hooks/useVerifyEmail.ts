import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { verifyEmail } from "../api/verifyEmailApi";

export const useVerifyEmail = (token: string | null) => {
  const query = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token as string),
    enabled: !!token,           // don't call the API without a token
    retry: false,               // a bad/used token won't fix itself
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const errorMessage =
    query.error instanceof AxiosError
      ? query.error.response?.data?.message ?? query.error.message
      : query.error
      ? "Something went wrong"
      : null;

  return { ...query, errorMessage };
};