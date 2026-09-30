import {  updateProfile } from "../types/profile"
import { AxiosError } from "axios"
import { api } from "@/axios/api"

export const updateProfileApi=async(data:updateProfile)=>{
    try{
        const formData=new FormData()
        formData.append("userName",data.userName)
        formData.append("email",data.email)
        data.image&&formData.append("image",data.image)
        data.phoneNumber&&formData.append("phoneNumber",data.phoneNumber)
    const res=await api.patch("profile/updateProfile",formData)
    console.log("update res",res.data);
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