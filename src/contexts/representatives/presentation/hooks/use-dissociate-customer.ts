"use client";

import { useMutation } from "@tanstack/react-query";
import { dissociateCustomerUseCase } from "../../di";

export function useDissociateCustomer() {
  return useMutation({
    mutationFn: ({ representativeId, customerId }: { representativeId: string; customerId: string }) =>
      dissociateCustomerUseCase.execute(representativeId, customerId),
  });
}
