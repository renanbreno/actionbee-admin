"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUnitUseCase } from "../../di";

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUnitUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}
