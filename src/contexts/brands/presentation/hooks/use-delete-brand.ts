import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBrandUseCase } from "../../di";

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBrandUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}
