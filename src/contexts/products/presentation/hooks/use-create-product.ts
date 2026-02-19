"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductUseCase } from "../../di";
import {
  CreateProductDTO,
} from "../../domain/repositories/product-repository.interface";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      images,
      nutritionalTableImage,
    }: {
      data: CreateProductDTO;
      images: File[];
      nutritionalTableImage?: File;
    }) => createProductUseCase.execute(data, images, nutritionalTableImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
