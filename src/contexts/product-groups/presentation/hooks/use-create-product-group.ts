"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductGroupUseCase } from "../../di";
import { CreateProductGroupDto } from "../../domain/repositories/product-group-repository.interface";

export function useCreateProductGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProductGroupDto) => createProductGroupUseCase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-groups"] });
    },
  });
}
