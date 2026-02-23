"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUnitUseCase } from "../../di";
import { UpdateUnitInput } from "../../domain/entities/unit";

export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUnitInput }) =>
      updateUnitUseCase.execute(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}
