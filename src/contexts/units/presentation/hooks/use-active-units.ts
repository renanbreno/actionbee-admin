"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveUnitsUseCase } from "../../di";

export function useActiveUnits(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["units", "active"],
    queryFn: () => getActiveUnitsUseCase.execute(),
    ...options,
  });
}
