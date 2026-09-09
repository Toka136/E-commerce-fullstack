import { useQuery } from "@tanstack/react-query"
import { authMe } from "../api/authMe"

export const useAuthMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};