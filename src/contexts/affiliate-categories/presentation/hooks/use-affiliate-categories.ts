import { useQuery } from "@tanstack/react-query";
import { getAllAffiliateCategoriesUseCase } from "../../di";

export function useAffiliateCategories(includeInactive = false) {
  return useQuery({
    queryKey: ["affiliate-categories", includeInactive],
    queryFn: () => getAllAffiliateCategoriesUseCase.execute(includeInactive),
  });
}
