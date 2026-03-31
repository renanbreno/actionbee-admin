"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateDealUseCase } from "../../di";
import type { UpdateDealDTO } from "../../domain/repositories/crm-deal-repository.interface";

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDealDTO }) =>
      updateDealUseCase.execute(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deal", data.id] });
      toast.success("Negócio atualizado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
