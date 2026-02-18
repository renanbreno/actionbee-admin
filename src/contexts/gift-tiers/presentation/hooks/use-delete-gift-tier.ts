"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGiftTierUseCase } from "../../di";

export function useDeleteGiftTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGiftTierUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
    },
  });
}
