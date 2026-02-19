"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProductsUseCase } from "../../di";

export function useProducts(
  page: number,
  limit: number,
  search?: string,
  categoryId?: string,
) {
  return useQuery({
    queryKey: ["products", page, limit, search, categoryId],
    queryFn: () =>
      getAllProductsUseCase.execute(page, limit, search, categoryId),
  });
}
