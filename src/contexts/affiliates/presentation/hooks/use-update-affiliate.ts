"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAffiliateUseCase } from "../../di";
import { UpdateAffiliateDto } from "../../application/dto/update-affiliate.dto";

export function useUpdateAffiliate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAffiliateDto }) =>
      updateAffiliateUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
    },
  });
}
