import { useQuery } from "@tanstack/react-query";
import { getBrandByIdUseCase } from "../../di";

export function useBrand(id: string) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => getBrandByIdUseCase.execute(id),
    enabled: !!id,
  });
}
