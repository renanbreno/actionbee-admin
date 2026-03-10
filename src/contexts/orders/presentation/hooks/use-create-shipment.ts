"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createShipmentUseCase } from "../../di";

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => createShipmentUseCase.execute(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] });
      toast.success("Etiqueta gerada com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating shipment:", error);
      toast.error(error.message || "Erro ao gerar etiqueta Melhor Envio");
    },
  });
}
