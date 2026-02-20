import { useQuery } from "@tanstack/react-query";
import { getAllBrandsUseCase } from "../../di";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => getAllBrandsUseCase.execute(),
  });
}
