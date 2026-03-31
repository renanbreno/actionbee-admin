"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAccountsUseCase,
  createAccountUseCase,
  updateAccountUseCase,
} from "../../di";

export function useFinancialAccounts() {
  return useQuery({
    queryKey: ["financial-accounts"],
    queryFn: () => getAccountsUseCase.execute(),
  });
}

export function useCreateFinancialAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; type: string; initialBalance?: number; bankName?: string; agency?: string; accountNumber?: string }) =>
      createAccountUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Conta criada com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateFinancialAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; bankName?: string; agency?: string; accountNumber?: string; active?: boolean } }) =>
      updateAccountUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["financial-dashboard"] });
      toast.success("Conta atualizada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
