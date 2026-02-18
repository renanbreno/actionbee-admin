"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGiftTierUseCase } from "../../di";
import { UpdateGiftTierDto } from "../../application/dto/update-gift-tier.dto";

export function useUpdateGiftTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGiftTierDto }) =>
      updateGiftTierUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
    },
  });
}
