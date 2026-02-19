"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductByIdUseCase } from "../../di";

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductByIdUseCase.execute(id),
    enabled: !!id,
  });
}
