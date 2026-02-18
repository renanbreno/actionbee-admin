"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGiftTierUseCase } from "../../di";
import { CreateGiftTierDto } from "../../application/dto/create-gift-tier.dto";

export function useCreateGiftTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGiftTierDto) => createGiftTierUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
    },
  });
}
