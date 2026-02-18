"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateGiftTierUseCase } from "../../di";

export function useDeactivateGiftTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateGiftTierUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
    },
  });
}
