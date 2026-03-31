"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCase, updateSettingsUseCase } from "../../di";

export function useFinancialSettings() {
  return useQuery({
    queryKey: ["financial-settings"],
    queryFn: () => getSettingsUseCase.execute(),
  });
}

export function useUpdateFinancialSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { creditCardSettlementDays?: number; debitCardSettlementDays?: number; pixSettlementDays?: number; boletoSettlementDays?: number; boletoAccountId?: string | null; mercadoPagoAccountId?: string | null; pixDirectAccountId?: string | null; defaultOrderCategoryId?: string | null }) =>
      updateSettingsUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-settings"] });
      toast.success("Configurações salvas");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
