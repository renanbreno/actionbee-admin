import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrandUseCase } from "../../di";
import { UpdateBrandDTO } from "../../domain/repositories/brand-repository.interface";

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDTO }) =>
      updateBrandUseCase.execute(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brands", variables.id] });
    },
  });
}
