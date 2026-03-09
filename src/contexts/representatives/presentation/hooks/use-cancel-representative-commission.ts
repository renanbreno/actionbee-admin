"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { representativesApiClient } from "../../infrastructure/api/representatives-api.client";

export function useCancelRepresentativeCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => representativesApiClient.cancelRepresentativeCommission(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-report"] });
      toast.success("Comissão cancelada");
    },
    onError: (error: Error) => {
      console.error("Error cancelling representative commission:", error);
      toast.error("Erro ao cancelar comissão");
    },
  });
}
