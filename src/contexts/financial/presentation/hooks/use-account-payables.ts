"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPayablesUseCase,
  createPayableUseCase,
  payPayableUseCase,
  cancelPayableUseCase,
} from "../../di";

interface PayableFilters {
  status?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  supplierId?: string;
}

export function useAccountPayables(filters?: PayableFilters) {
  return useQuery({
    queryKey: ["financial-payables", filters],
    queryFn: () => getPayablesUseCase.execute(filters),
  });
}

export function useCreatePayable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { description: string; amount: number; dueDate: string; categoryId: string; accountId?: string; supplierId?: string; notes?: string }) =>
      createPayableUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-payables"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Conta a pagar criada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function usePayPayable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { paidAt: string; paidAmount: number; accountId?: string } }) =>
      payPayableUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-payables"] });
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Pagamento registrado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCancelPayable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelPayableUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-payables"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Conta a pagar cancelada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
