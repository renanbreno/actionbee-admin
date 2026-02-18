"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAffiliateUseCase } from "../../di";

export function useDeleteAffiliate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAffiliateUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
    },
  });
}
