"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { vendedoresApiClient } from "../../infrastructure/api/vendedores-api.client";

export function useMarkVendedorCommissionPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => vendedoresApiClient.markCommissionPaid(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedor-sales-report"] });
      toast.success("Comissão marcada como paga");
    },
    onError: (error: Error) => {
      console.error("Error marking vendedor commission as paid:", error);
      toast.error("Erro ao marcar comissão como paga");
    },
  });
}
