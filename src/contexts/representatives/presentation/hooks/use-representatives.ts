"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllRepresentativesUseCase } from "../../di";

export function useRepresentatives(name?: string) {
  return useQuery({
    queryKey: ["representatives", name],
    queryFn: () => getAllRepresentativesUseCase.execute(name),
  });
}
