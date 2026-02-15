"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryUseCase } from "../../di";
import { UpdateCategoryDto } from "../../application/dto/update-category.dto";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      updateCategoryUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
