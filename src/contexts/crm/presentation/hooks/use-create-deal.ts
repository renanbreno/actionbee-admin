"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createDealUseCase } from "../../di";
import type { CreateDealDTO } from "../../domain/repositories/crm-deal-repository.interface";

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDealDTO) => createDealUseCase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Negócio criado com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
