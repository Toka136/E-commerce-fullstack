import { useMutation } from "@tanstack/react-query"
import { CreateOrderParams } from "../types/orders"
import { createOrder } from "../api/createOrder"
import { useRouter } from "next/navigation"

export const useCreateOrder=()=>{
    const router=useRouter()
    return useMutation({
        mutationFn:({data,idempotencyKey}:{data:CreateOrderParams,idempotencyKey:string})=>createOrder(data,idempotencyKey),
         onSuccess: (response) => {
           console.log("responseOrderOnline", response);

             const orderId = response.data.id;
            if(response?.data?.paymentMethod.toLowerCase()==="online")
            {
                router.push(`/payment/pay/${orderId}`);
            }
     
      else
      router.push(`/order-success/${orderId}`);
    },
    })
}