"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RemoveFromCartApi } from "../api/removeFromCartApi";
import { toast } from "react-toastify";
export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
    }: {
      productId: string;
    }) => RemoveFromCartApi(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if(response.data.couponRemoved){
        toast.warning(response.data.couponMessage);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
};