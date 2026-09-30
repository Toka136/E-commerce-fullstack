"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RemoveFromCartApi } from "../api/removeFromCartApi";
export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
    }: {
      productId: string;
    }) => RemoveFromCartApi(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};