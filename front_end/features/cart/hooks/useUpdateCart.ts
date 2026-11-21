"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  AddToCartApi } from "../api/addToCartApi";
import { updateCart } from "../api/updateCartApi";
import { toast } from "react-toastify";
export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => updateCart(productId, quantity??1),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if(response.data.couponRemoved)
      {
        toast.warning(response.data.couponMessage);
      }
      // onOpen()
    },
    onError: (err) => {
      console.log(err);
    },
  });
};