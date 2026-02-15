"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriesUseCase } from "../../di";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesUseCase.execute(),
  });
}
