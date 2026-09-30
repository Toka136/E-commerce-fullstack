import { useQuery } from "@tanstack/react-query";
import { authAdmin } from "../api/authAdmin";

export const useAuthAdmin = () => {
    return useQuery({
        queryKey: ["auth", "admin"],
        queryFn: authAdmin,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};