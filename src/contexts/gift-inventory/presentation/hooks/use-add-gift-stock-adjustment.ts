"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addGiftStockAdjustmentUseCase } from "../../di";
import { AddGiftStockAdjustmentDTO } from "../../application/dto/add-gift-stock-adjustment.dto";

export function useAddGiftStockAdjustment(giftTierId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddGiftStockAdjustmentDTO) =>
      addGiftStockAdjustmentUseCase.execute(giftTierId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
      queryClient.invalidateQueries({ queryKey: ["gift-stock-movements", giftTierId] });
      toast.success("Ajuste realizado com sucesso");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Erro ao realizar ajuste"),
  });
}
