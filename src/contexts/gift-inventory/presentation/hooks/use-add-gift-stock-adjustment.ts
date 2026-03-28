"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addGiftStockAdjustmentUseCase } from "../../di";
import { GiftStockAdjustmentFormValues } from "../schemas/gift-stock-adjustment.schema";

export function useAddGiftStockAdjustment(giftTierId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: GiftStockAdjustmentFormValues) => {
      const signedQuantity = values.operation === "remove" ? -values.quantity : values.quantity;
      return addGiftStockAdjustmentUseCase.execute(giftTierId, {
        quantity: signedQuantity,
        reason: values.reason || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
      queryClient.invalidateQueries({ queryKey: ["gift-stock-movements", giftTierId] });
      toast.success("Ajuste realizado com sucesso");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Erro ao realizar ajuste"),
  });
}
