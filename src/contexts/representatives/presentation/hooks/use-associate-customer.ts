"use client";

import { useMutation } from "@tanstack/react-query";
import { associateCustomerUseCase } from "../../di";

export function useAssociateCustomer() {
  return useMutation({
    mutationFn: ({ representativeId, customerId }: { representativeId: string; customerId: string }) =>
      associateCustomerUseCase.execute(representativeId, customerId),
  });
}
