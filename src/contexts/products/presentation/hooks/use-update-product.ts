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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}
