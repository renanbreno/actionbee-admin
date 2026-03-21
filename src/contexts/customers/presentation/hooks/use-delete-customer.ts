"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomerUseCase } from "../../di";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomerUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
