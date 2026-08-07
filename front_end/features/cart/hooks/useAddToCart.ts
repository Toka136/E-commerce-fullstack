"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  AddToCartApi } from "../api/addToCartApi";
import { useCartStore } from "../store/cart-store";
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
    const {onOpen}=useCartStore()

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => AddToCartApi(productId, quantity??1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      onOpen()
    },
    onError: (err) => {
      console.log(err);
    },
  });
};