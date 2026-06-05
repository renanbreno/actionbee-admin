import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFlavorUseCase } from "../../di";
import { CreateFlavorDTO } from "../../domain/repositories/flavor-repository.interface";

export function useCreateFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFlavorDTO) => createFlavorUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flavors"] });
    },
  });
}
