"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnitUseCase } from "../../di";
import { CreateUnitInput } from "../../domain/entities/unit";

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUnitInput) => createUnitUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}
