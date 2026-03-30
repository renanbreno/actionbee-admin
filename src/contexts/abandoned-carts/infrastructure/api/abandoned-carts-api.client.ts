import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { PaginatedAbandonedCarts } from "../../domain/entities/abandoned-cart.entity";
import { GetAbandonedCartsFiltersDTO } from "../../application/dto/get-abandoned-carts-filters.dto";

export const abandonedCartsApiClient = {
  getAll(filters: GetAbandonedCartsFiltersDTO): Promise<PaginatedAbandonedCarts> {
    const params = new URLSearchParams();
    params.append("page", filters.page.toString());
    params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.checkoutStep) params.append("checkoutStep", filters.checkoutStep);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.customerId) params.append("customerId", filters.customerId);

    return apiFetch<PaginatedAbandonedCarts>(`/admin/abandoned-carts?${params.toString()}`);
  },
};
