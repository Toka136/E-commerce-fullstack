import { apiServer } from "@/axios/apiServer"
import { GetProfileResponse } from "../types/profile"
import { AxiosError } from "axios"

export const getProfileApi=async():Promise<GetProfileResponse>=>{
    const res=await apiServer.get("profile/getProfile")
    console.log("resProfile",res.data)
    return res.data
}