'use client'
import { useRouter } from "next/navigation";
import { Register } from "../api/registerApi"
import { registerInputT } from "../types/registerType"
import {  toast } from 'react-toastify';
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
            console.log("err",err)
            const error=err as {message:string}
            if(error.message.includes("User Already Exists"))
            toast.error(error.message)
            else
            toast.error("something went wrong")
        }
       
       
    }
    return {handleRegister}
}