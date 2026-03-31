"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSuppliersUseCase,
  createSupplierUseCase,
  updateSupplierUseCase,
  deleteSupplierUseCase,
} from "../../di";
import type { Supplier } from "../../domain/entities/supplier";

export function useSuppliers(params?: { active?: boolean; search?: string }) {
  return useQuery({
    queryKey: ["financial-suppliers", params],
    queryFn: () => getSuppliersUseCase.execute(params),
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      razaoSocial: string;
      nomeFantasia?: string;
      cnpj?: string;
      inscricaoEstadual?: string;
      email?: string;
      phone?: string;
      street?: string;
      number?: string;
      complement?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      notes?: string;
      active?: boolean;
    }) => createSupplierUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-suppliers"] });
      toast.success("Fornecedor criado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateSupplierUseCase.execute>[1] }) =>
      updateSupplierUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-suppliers"] });
      toast.success("Fornecedor atualizado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSupplierUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-suppliers"] });
      toast.success("Fornecedor excluído");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
