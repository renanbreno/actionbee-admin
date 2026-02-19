import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomerUseCase } from "../../di";
import type { CreateCustomerDTO } from "../../domain/repositories/customer-repository.interface";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDTO) => createCustomerUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
