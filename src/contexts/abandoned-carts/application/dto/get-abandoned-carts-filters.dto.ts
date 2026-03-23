export interface GetAbandonedCartsFiltersDTO {
  page: number;
  limit: number;
  search?: string;
  checkoutStep?: string;
  startDate?: string;
  endDate?: string;
}
