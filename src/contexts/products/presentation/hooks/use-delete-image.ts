"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApiClient } from "../../infrastructure/api/products-api.client";

export function useDeleteImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      productsApiClient.deleteImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });
}
