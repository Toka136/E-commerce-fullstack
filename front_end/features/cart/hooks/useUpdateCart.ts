"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  AddToCartApi } from "../api/addToCartApi";
import { updateCart } from "../api/updateCartApi";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // onOpen()
    },
    onError: (err) => {
      console.log(err);
    },
  });
};