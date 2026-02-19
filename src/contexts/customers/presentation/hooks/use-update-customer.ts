import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerUseCase } from "../../di";
import type { UpdateCustomerDTO } from "../../domain/repositories/customer-repository.interface";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDTO }) =>
      updateCustomerUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
