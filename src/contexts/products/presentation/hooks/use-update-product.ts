"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductUseCase } from "../../di";
import {
  UpdateProductDTO,
} from "../../domain/repositories/product-repository.interface";

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      images,
      nutritionalTableImage,
    }: {
      data: UpdateProductDTO;
      images?: File[];
      nutritionalTableImage?: File;
    }) => updateProductUseCase.execute(id, data, images, nutritionalTableImage),
    onSuccess: () => {
      // Remove the specific product from cache so the edit page always fetches
      // fresh data on next open, preventing stale values from being shown in the form.
      queryClient.removeQueries({ queryKey: ["products", id], exact: true });
      // Invalidate the list so it refetches in the background.
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
