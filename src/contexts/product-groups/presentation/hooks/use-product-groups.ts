"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductGroupsUseCase } from "../../di";

export function useProductGroups() {
  return useQuery({
    queryKey: ["product-groups"],
    queryFn: () => getProductGroupsUseCase.execute(),
  });
}
