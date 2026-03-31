"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTransactionsUseCase,
  createTransactionUseCase,
  createTransferUseCase,
} from "../../di";

interface TransactionFilters {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  accountId?: string;
}

export function useFinancialTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ["financial-transactions", filters],
    queryFn: () => getTransactionsUseCase.execute(filters),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: string; amount: number; date: string; description: string; accountId: string; categoryId?: string }) =>
      createTransactionUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Lançamento criado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; date: string; description: string; sourceAccountId: string; destinationAccountId: string }) =>
      createTransferUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Transferência realizada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
