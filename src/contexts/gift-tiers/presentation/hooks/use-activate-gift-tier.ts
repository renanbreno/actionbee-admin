"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateGiftTierUseCase } from "../../di";

export function useActivateGiftTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateGiftTierUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
    },
  });
}
