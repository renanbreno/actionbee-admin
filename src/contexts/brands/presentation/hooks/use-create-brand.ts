import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrandUseCase } from "../../di";
import { CreateBrandDTO } from "../../domain/repositories/brand-repository.interface";

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandDTO) => createBrandUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}
