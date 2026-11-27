"use client"
import { toast } from "react-toastify"
import { Login } from "../api/loginApi"
import { loginInputT } from "../types/loginType"
import { useRouter } from "next/navigation"
export const useLogin=()=>{

  const router=useRouter()
  const handleLogin=async(data:loginInputT)=>{
    try{
    const res=await Login(data)
    console.log("res",res)
     toast.success("User logged in Successfully")
     console.log("res",res)
            setTimeout(() => {
              
              if(res.data.newUser.role.toLowerCase()==="user")
              router.push("/dashboard")
              else
                router.push("/admin/dashboard")
    
            }, 2000);
  }catch(err){
       console.log("err",err)
       const error=err as {message:string}
       if(error.message.includes("Invalid Credentials"))
       toast.error(error.message)
       else
        toast.error(error.message)
    }
  }
  return {handleLogin}
}