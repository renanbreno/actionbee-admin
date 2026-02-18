import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAffiliateCategoryUseCase } from "../../di";
import type { UpdateAffiliateCategoryDTO } from "../../domain/repositories/affiliate-category-repository.interface";

export function useUpdateAffiliateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAffiliateCategoryDTO }) =>
      updateAffiliateCategoryUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-categories"] });
    },
  });
}
