import { AuthStoreT } from "@/features/Auth/types/authStoreType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore=create<AuthStoreT>()(
    persist(
    (set=>({
    isLoggedIn:false,
   userData:{userName:"",userAvatar:"",userRole:"",_id:""},
    login:()=>set(state=>({isLoggedIn:true})),
    logout:()=>set(state=>({isLoggedIn:false,userData:{userName:"",userAvatar:"",userRole:"",_id:""}})),
    setUserData:(name:string,userAvatar?:string,userRole?:string,_id?:string)=>set(state=>({userData:{userName:name,userAvatar:userAvatar,userRole:userRole,_id:_id}})),
    
})),
{
    name:"auth-store"
}
)
)
