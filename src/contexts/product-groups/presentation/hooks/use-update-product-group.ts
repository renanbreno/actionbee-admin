"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductGroupUseCase } from "../../di";
import { UpdateProductGroupDto } from "../../domain/repositories/product-group-repository.interface";

export function useUpdateProductGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductGroupDto }) =>
      updateProductGroupUseCase.execute(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-groups"] });
    },
  });
}
