import { create } from "zustand";
import { wishlistStore } from "../types/wishlist";
import { persist } from "zustand/middleware";

export const useWishlistStore=create<wishlistStore>()(
    persist(
        (set)=>({
            count:0,
            setCount:(count:number)=>set({count})
        }),
    
    {
        name:"wishlist-store"
    }
        
    )

)