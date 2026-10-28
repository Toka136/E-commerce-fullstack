import { create } from "zustand";
import { cartItemT, CartT } from "../types/storeType";
import { persist } from "zustand/middleware";
import { date } from "yup";

export const useCartStore=create<CartT>()(
    persist(
        (set)=>({
            data:{
                userId:"",items:[]
            },
            cartCount:0,
            setCart:(userId:string,items:cartItemT[],cartCount:number)=>
                set({
                    data:{userId:userId,items:items
                    },
                    cartCount:cartCount
                }),
                addProductTocart:(product:cartItemT)=>{
                    set(state=>({
                        data:{userId:state.data.userId,items:[...state.data.items,product],cartCount:state.cartCount+1}
                    }))
                },
                removeProductFromCart:(product:string)=>{
                    set(state=>({
                        data:{userId:state.data.userId,items:state.data.items.filter(item=>item.product._id!==product),cartCount:state.cartCount-1}
                    }))
                },
                clearCart:()=>{
                    set(state=>({
                        data:{userId:state.data.userId,items:[],cartCount:0}
                    }))
                }
        }),
        {
            name:"cart-store"
        }
    )
);
  

