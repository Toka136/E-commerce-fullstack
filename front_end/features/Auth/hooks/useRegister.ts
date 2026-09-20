'use client'
import { useRouter } from "next/navigation";
import { Register } from "../api/registerApi"
import { registerInputT } from "../types/registerType"
import {  toast } from 'react-toastify';
import { AxiosError } from "axios";
  export const useRegister=()=>{
    const router=useRouter()
    const handleRegister=async(data:registerInputT)=>{
        try{
             const res=await Register(data)
        console.log("res",res)
        toast.success("User Created Successfully")
        setTimeout(() => {
            router.push("/login")

        }, 2000);

        }catch(err){
            const error=err as AxiosError
        if (err instanceof AxiosError) {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        console.log("MESSAGE:", err.response?.data?.message);
        
            toast.error(error.message)
        }
            else
            toast.error("something went wrong")
        }
       
       
    }
    return {handleRegister}
}