"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { vendedoresApiClient } from "../../infrastructure/api/vendedores-api.client";

export function useCancelVendedorCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => vendedoresApiClient.cancelCommission(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedor-sales-report"] });
      toast.success("Comissão cancelada");
    },
    onError: (error: Error) => {
      console.error("Error cancelling vendedor commission:", error);
      toast.error("Erro ao cancelar comissão");
    },
  });
}
