import { api } from "@/axios/api"
import { authMeResponse } from "../types/authMe"

export const authMe=async():Promise<authMeResponse>=>{
    const res=await api.get ("/auth/authMe")
    return res.data  
}