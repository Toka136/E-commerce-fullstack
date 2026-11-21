import { useRouter } from "next/navigation"
import { Logout } from "../api/logoutApi"

export const useLogout=()=>{
    const router=useRouter()
    const handleLogout = async () => {
    try {
        await Logout();

        router.replace("/");
        router.refresh();

    } catch (err) {
        console.error("Logout error:", err);
    }
    };
    return {handleLogout}
}