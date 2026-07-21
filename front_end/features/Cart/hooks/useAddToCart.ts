import { toast } from "react-toastify"
import { addToCart } from "../api/addToCart"
import { useCartStore } from "../store/cart-store"
import { cartItemT, productT } from "../types/storeType"

export const UseAddToCart=()=>{
    const addProductTocart=useCartStore((state)=>state.addProductTocart)
    const useHandleAddToCart=async(book:productT)=>{
        console.log("book",book)
         try{
        const res=await addToCart(book._id)
        addProductTocart({product:book,quantity:1})
        return res
    }catch(err){
        console.log("err",err)
        const error=err as {message:string}
        toast.error(error.message)
    }
    }
    return {useHandleAddToCart}
   
}