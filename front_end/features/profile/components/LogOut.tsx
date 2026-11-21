"use client"
import { useLogout } from "@/features/Auth/hooks/useLogout"
import { LogOutIcon } from "lucide-react"

export const LogOutButton=()=>{
    const {handleLogout}=useLogout()
    return (
         <button
              onClick={handleLogout}
                type="button"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-error transition hover:bg-error-container/40"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
    )
}