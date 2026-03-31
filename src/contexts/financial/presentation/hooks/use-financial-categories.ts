"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCategoriesUseCase,
  createCategoryUseCase,
  updateCategoryUseCase,
  deleteCategoryUseCase,
} from "../../di";

export function useFinancialCategories(type?: string) {
  return useQuery({
    queryKey: ["financial-categories", type],
    queryFn: () => getCategoriesUseCase.execute(type),
  });
}

export function useCreateFinancialCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; type: string; color?: string }) =>
      createCategoryUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-categories"] });
      toast.success("Categoria criada com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateFinancialCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; color?: string; active?: boolean } }) =>
      updateCategoryUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-categories"] });
      toast.success("Categoria atualizada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteFinancialCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategoryUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-categories"] });
      toast.success("Categoria excluída");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
