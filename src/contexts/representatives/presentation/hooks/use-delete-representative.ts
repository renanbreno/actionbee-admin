"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRepresentativeUseCase } from "../../di";

export function useDeleteRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRepresentativeUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
    },
  });
}
