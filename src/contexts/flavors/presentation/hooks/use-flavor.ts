import { useQuery } from "@tanstack/react-query";
import { getFlavorByIdUseCase } from "../../di";

export function useFlavor(id: string) {
  return useQuery({
    queryKey: ["flavors", id],
    queryFn: () => getFlavorByIdUseCase.execute(id),
    enabled: !!id,
  });
}
