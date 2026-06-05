import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFlavorUseCase } from "../../di";
import { UpdateFlavorDTO } from "../../domain/repositories/flavor-repository.interface";

export function useUpdateFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFlavorDTO }) =>
      updateFlavorUseCase.execute(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["flavors"] });
      queryClient.invalidateQueries({ queryKey: ["flavors", variables.id] });
    },
  });
}
