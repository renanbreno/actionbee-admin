"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addStockEntryUseCase } from "../../di";
import { AddStockEntryDTO } from "../../application/dto/add-stock-entry.dto";

export function useAddStockEntry(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddStockEntryDTO) =>
      addStockEntryUseCase.execute(productId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-batches", productId] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements", productId] });
      toast.success("Lote adicionado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar lote");
    },
  });
}
