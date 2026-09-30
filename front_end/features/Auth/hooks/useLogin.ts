"use client"
import { toast } from "react-toastify"
import { Login } from "../api/loginApi"
import { useAuthStore } from "../store/auth-store"
import { loginInputT } from "../types/loginType"
import { useRouter } from "next/navigation"
export const useLogin=()=>{
  const login=useAuthStore((state)=>state.login)
  const setUserData=useAuthStore((state)=>state.setUserData)
  const router=useRouter()
  const handleLogin=async(data:loginInputT)=>{
    try{
    const res=await Login(data)
    console.log("res",res)
    login();
    setUserData(res.data.newUser.userName,res.data.newUser.image,res.data.newUser.role,res.data.newUser._id);
     toast.success("User logged in Successfully")
            setTimeout(() => {
              if(res.data.newUser.role==="user")
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
        toast.error("error data")
    }
  }
  return {handleLogin}
}