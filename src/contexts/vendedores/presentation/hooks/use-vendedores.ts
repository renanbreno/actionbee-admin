"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllVendedoresUseCase } from "../../di";

export function useVendedores(name?: string) {
  return useQuery({
    queryKey: ["vendedores", name],
    queryFn: () => getAllVendedoresUseCase.execute(name),
  });
}
