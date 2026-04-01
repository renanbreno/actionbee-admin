"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getReceivablesUseCase,
  getReceivableByIdUseCase,
  createReceivableUseCase,
  payReceivableUseCase,
  cancelReceivableUseCase,
  reverseReceivableUseCase,
} from "../../di";

interface ReceivableFilters {
  status?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  customerId?: string;
  orderId?: string;
  customerName?: string;
}

export function useAccountReceivables(filters?: ReceivableFilters) {
  return useQuery({
    queryKey: ["financial-receivables", filters],
    queryFn: () => getReceivablesUseCase.execute(filters),
  });
}

export function useReceivableDetail(id: string) {
  return useQuery({
    queryKey: ["financial-receivable", id],
    queryFn: () => getReceivableByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useReceivablesByOrder(orderId: string | null) {
  return useQuery({
    queryKey: ["financial-receivables", { orderId }],
    queryFn: () => getReceivablesUseCase.execute({ orderId: orderId! }),
    enabled: !!orderId,
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

export function useReverseReceivable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reverseReceivableUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-receivables"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Estorno realizado com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
