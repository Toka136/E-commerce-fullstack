import { useAuthStore } from "@/features/Auth/store/auth-store"

export  async function authFetch(url:RequestInfo,options:RequestInit){
    console.log("options",options)
    let response=await fetch(url,{
        ...options,
        credentials:"include"
    })
    console.log("response in refresh token",response)
    if(response.status===401){
        const refreshResponse=await fetch("http://localhost:4000/api/auth/refreshToken",{
            method:"POST",
            credentials:"include"
        })
        if(refreshResponse.ok)
        {
            response=await fetch(url,{
        ...options,
        credentials:"include"
        })

        }else
        {
            useAuthStore.getState().logout()
        }
    }
    return response
}