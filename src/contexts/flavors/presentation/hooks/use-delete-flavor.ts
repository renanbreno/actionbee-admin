import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFlavorUseCase } from "../../di";

export function useDeleteFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFlavorUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flavors"] });
    },
  });
}
