import { api } from "@/axios/api"
import { GetProfileResponse } from "@/features/profile/types/profile"
import { AxiosError } from "axios"

export const authAdmin=async():Promise<GetProfileResponse>=>{
    try{
    const res=await api.get("profile/getProfile")
    return res.data
    }
    catch(err)
    {
        const error=err as AxiosError
          if (err instanceof AxiosError) {
          console.log("STATUS:", err.response?.status);
          console.log("DATA:", err.response?.data);
          console.log("MESSAGE:", err.response?.data?.message);
        }
  
        throw err;
    }
}