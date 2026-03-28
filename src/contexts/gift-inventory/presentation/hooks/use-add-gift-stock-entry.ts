"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addGiftStockEntryUseCase } from "../../di";
import { AddGiftStockEntryDTO } from "../../application/dto/add-gift-stock-entry.dto";

export function useAddGiftStockEntry(giftTierId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddGiftStockEntryDTO) =>
      addGiftStockEntryUseCase.execute(giftTierId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-tiers"] });
      queryClient.invalidateQueries({ queryKey: ["gift-stock-movements", giftTierId] });
      toast.success("Estoque adicionado com sucesso");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Erro ao adicionar estoque"),
  });
}
