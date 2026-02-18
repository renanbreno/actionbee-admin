import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAffiliateCategoryUseCase } from "../../di";
import type { CreateAffiliateCategoryDTO } from "../../domain/repositories/affiliate-category-repository.interface";

export function useCreateAffiliateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAffiliateCategoryDTO) =>
      createAffiliateCategoryUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-categories"] });
    },
  });
}
