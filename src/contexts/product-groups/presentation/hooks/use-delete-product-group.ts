"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductGroupUseCase } from "../../di";

export function useDeleteProductGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductGroupUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-groups"] });
    },
  });
}
