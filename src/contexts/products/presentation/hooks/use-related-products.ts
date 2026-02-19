"use client";

import { useQuery } from "@tanstack/react-query";
import { getRelatedProductsUseCase } from "../../di";

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: ["products", productId, "related"],
    queryFn: () => getRelatedProductsUseCase.execute(productId),
    enabled: !!productId,
  });
}
