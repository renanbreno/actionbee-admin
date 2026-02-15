"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryUseCase } from "../../di";
import { CreateCategoryDto } from "../../application/dto/create-category.dto";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) =>
      createCategoryUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
