export interface GetOrdersFiltersDTO {
  page: number;
  limit: number;
  search?: string;
  customerName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
