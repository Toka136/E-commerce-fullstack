import { create } from "zustand";
import { CartItem, cartStore, UICartItem } from "../types/cart";
import { persist } from "zustand/middleware";

export const useCartStore=create<cartStore>()(
    persist(
        (set)=>({
         
            isOpen:false,
            onOpen:()=>set({isOpen:true}),
            onClose:()=>set({isOpen:false}),
        }),
        {
            name:"cart",
        }
    )
)