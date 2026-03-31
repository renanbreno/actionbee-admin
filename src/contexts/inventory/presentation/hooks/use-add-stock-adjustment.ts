import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addStockAdjustmentUseCase } from "../../di";
import { AddStockAdjustmentDTO } from "../../application/dto/add-stock-adjustment.dto";

export function useAddStockAdjustment(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddStockAdjustmentDTO) =>
      addStockAdjustmentUseCase.execute(productId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-batches", productId] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements", productId] });
      toast.success("Ajuste realizado com sucesso");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Erro ao realizar ajuste de estoque"),
  });
}
