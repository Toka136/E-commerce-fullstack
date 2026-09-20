import { GetProfileResponse } from "../types/profile"
import { AxiosError } from "axios"
import { api } from "@/axios/api"

export const getUserData=async():Promise<GetProfileResponse>=>{
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