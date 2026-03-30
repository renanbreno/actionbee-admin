export interface GetOrdersFiltersDTO {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}
