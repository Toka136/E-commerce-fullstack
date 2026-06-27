import { authFetch } from "@/utils/authFetch";

export const Logout=async()=>{
    
   
  
    const res =await authFetch("http://localhost:4000/api/auth/logout",{
        method:"POST",
        credentials:"include"
    })
    const result = await res.json();
    console.log("result logout",result)
    if(!res.ok)
      throw new Error(result.message);
    return result
}
