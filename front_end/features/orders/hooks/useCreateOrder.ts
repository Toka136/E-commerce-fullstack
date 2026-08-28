import { useMutation } from "@tanstack/react-query"
import { CreateOrderParams } from "../types/orders"
import { createOrder } from "../api/createOrder"
import { useRouter } from "next/navigation"

export const useCreateOrder=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:(data:CreateOrderParams)=>createOrder(data),
         onSuccess: (response) => {
      const orderId = response.data._id;
      console.log("Order ID:", orderId);

      router.push(`/order-success/?orderId=${orderId}`);
    },
    })
}