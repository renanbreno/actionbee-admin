"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerByIdUseCase } from "../../di";

export function useCustomerDetails(customerId: string | null) {
  return useQuery({
    queryKey: ["customer-details", customerId],
    queryFn: () => getCustomerByIdUseCase.execute(customerId!),
    enabled: !!customerId,
  });
}
