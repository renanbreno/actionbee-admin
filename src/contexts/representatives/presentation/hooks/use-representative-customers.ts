"use client";

import { useQuery } from "@tanstack/react-query";
import { getRepresentativeCustomersUseCase } from "../../di";

export function useRepresentativeCustomers(representativeId: string | null) {
  return useQuery({
    queryKey: ["representative-customers", representativeId],
    queryFn: () => getRepresentativeCustomersUseCase.execute(representativeId!),
    enabled: !!representativeId,
  });
}
