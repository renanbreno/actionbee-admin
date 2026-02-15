"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryUseCase } from "../../di";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
