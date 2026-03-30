import { useQuery } from "@tanstack/react-query";
import { getAllCustomersUseCase } from "../../di";
import type { PurchaseStatus, CustomerTypeFilter, LifecycleStageFilter } from "../../domain/repositories/customer-repository.interface";

export function useCustomers(
  page: number,
  limit: number,
  search?: string,
  purchaseStatus?: PurchaseStatus,
  customerType?: CustomerTypeFilter,
  lifecycleStage?: LifecycleStageFilter
) {
  return useQuery({
    queryKey: ["customers", page, limit, search, purchaseStatus, customerType, lifecycleStage],
    queryFn: () => getAllCustomersUseCase.execute(page, limit, search, purchaseStatus, customerType, lifecycleStage),
  });
}
