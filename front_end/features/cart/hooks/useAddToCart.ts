"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddToCartApi } from "../api/addToCartApi";
import { toast } from "react-toastify";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => AddToCartApi(productId, quantity ?? 1),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      if (response.data.couponRemoved) {
        toast.success("Product added to cart successfully");
        setTimeout(() => {
          toast.warning(response.data.couponMessage);
        }, 2000);
      } else {
        toast.success("Product added to cart successfully");
      }
    },

    onError: (err) => {
      console.log(err);
      toast.error("Failed to add product to cart");
    },
  });
};