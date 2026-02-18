"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllAffiliatesUseCase } from "../../di";

export function useAffiliates() {
  return useQuery({
    queryKey: ["affiliates"],
    queryFn: () => getAllAffiliatesUseCase.execute(),
  });
}
