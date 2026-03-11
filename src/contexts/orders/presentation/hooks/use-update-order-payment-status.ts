"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderPaymentStatusUseCase } from "../../di";
import { UpdateOrderPaymentStatusDTO } from "../../application/dto/update-order-payment-status.dto";

export function useUpdateOrderPaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateOrderPaymentStatusDTO }) =>
      updateOrderPaymentStatusUseCase.execute(id, params),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      toast.success("Status do pagamento atualizado");
    },
    onError: (error: Error) => {
      console.error("Error updating order payment status:", error);
      toast.error(error.message || "Erro ao atualizar status do pagamento");
    },
  });
}
