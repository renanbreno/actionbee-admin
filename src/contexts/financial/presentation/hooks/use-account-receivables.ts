"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getReceivablesUseCase,
  createReceivableUseCase,
  payReceivableUseCase,
  cancelReceivableUseCase,
} from "../../di";

interface ReceivableFilters {
  status?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  customerId?: string;
  orderId?: string;
}

export function useAccountReceivables(filters?: ReceivableFilters) {
  return useQuery({
    queryKey: ["financial-receivables", filters],
    queryFn: () => getReceivablesUseCase.execute(filters),
  });
}

export function useCreateReceivable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { description: string; amount: number; dueDate: string; categoryId: string; accountId?: string; notes?: string }) =>
      createReceivableUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-receivables"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Conta a receber criada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function usePayReceivable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { paidAt: string; paidAmount: number; accountId?: string } }) =>
      payReceivableUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-receivables"] });
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Recebimento registrado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCancelReceivable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelReceivableUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-receivables"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Conta a receber cancelada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
