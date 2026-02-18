import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAffiliateCategoryUseCase } from "../../di";

export function useDeleteAffiliateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAffiliateCategoryUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-categories"] });
    },
  });
}
