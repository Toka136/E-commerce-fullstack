import { useRouter } from "next/navigation"
import { useAuthStore } from "../store/auth-store"
import { Logout } from "../api/logoutApi"

export const useLogout=()=>{
    const logout=useAuthStore((state)=>state.logout)
    const router=useRouter()
    const handleLogout=async ()=>{
        try{
            const res= await Logout()
              logout()
             router.push("/login")

        }catch(err){
            console.log("err",err)
        }
      
    }
    return {handleLogout}
}