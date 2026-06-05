import { useQuery } from "@tanstack/react-query";
import { getAllFlavorsUseCase } from "../../di";

export function useFlavors() {
  return useQuery({
    queryKey: ["flavors"],
    queryFn: () => getAllFlavorsUseCase.execute(),
  });
}
