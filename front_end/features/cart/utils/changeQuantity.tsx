import { useAddToCartMutation } from "../hooks/useAddToCart";
import { useCartStore } from "../store/cart-store"

export const useChangeQuantity=()=>{
   const{updateQuantity}=useCartStore()
    const { mutate: addToCartMutation, isPending } = useAddToCartMutation();
   
   const handleChangeQuantity=(id:string,quantity:number)=>{
      try{

       addToCartMutation({productId:id,quantity})
    updateQuantity(id,quantity)
      }
      catch(err){
         console.log(err)
      
      }
   }
   return {handleChangeQuantity,isPending}
}