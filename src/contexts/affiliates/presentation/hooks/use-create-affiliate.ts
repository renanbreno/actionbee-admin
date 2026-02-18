"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAffiliateUseCase } from "../../di";
import { CreateAffiliateDto } from "../../application/dto/create-affiliate.dto";

export function useCreateAffiliate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAffiliateDto) => createAffiliateUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
    },
  });
}
