import axios, { AxiosError } from "axios";
import { registerInputT } from "../types/registerType";
import { api } from "@/axios/api";

export const Register=async(data:registerInputT)=>{
     console.log("data from api",data)
     const formData=new FormData()
    formData.append("userName",data.userName)
    formData.append("email",data.email)
    formData.append("phoneNumber",data.phoneNumber)
    formData.append("password",data.password)
    data.image&&formData.append("image",data.image)
     console.log("dataregform",formData.values())
    const res =await api.post("auth/register",formData)
     
   
    return res.data;
}
