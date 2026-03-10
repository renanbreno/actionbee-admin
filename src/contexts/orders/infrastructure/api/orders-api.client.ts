import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { OrderDetail, OrderListItem, PaginatedOrders } from "../../domain/entities/order";
import { GetOrdersFiltersDTO } from "../../application/dto/get-orders-filters.dto";
import { CreateOrderDTO } from "../../application/dto/create-order.dto";
import { UpdateOrderStatusDTO } from "../../application/dto/update-order-status.dto";
import { CreateShipmentResult } from "../../domain/repositories/order-repository.interface";

export const ordersApiClient = {
  getAll(filters: GetOrdersFiltersDTO): Promise<PaginatedOrders> {
    const params = new URLSearchParams();
    params.append("page", filters.page.toString());
    params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    return apiFetch<PaginatedOrders>(`/admin/orders?${params.toString()}`);
  },

  getById(id: string): Promise<OrderDetail> {
    return apiFetch<OrderDetail>(`/admin/orders/${id}`);
  },

  create(data: CreateOrderDTO): Promise<OrderListItem> {
    return apiFetch<OrderListItem>("/admin/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStatus(id: string, data: UpdateOrderStatusDTO): Promise<void> {
    return apiFetch<void>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  createShipment(id: string): Promise<CreateShipmentResult> {
    return apiFetch<CreateShipmentResult>(`/admin/orders/${id}/shipment`, {
      method: "POST",
    });
  },

  getShipmentLabel(id: string): Promise<{ labelUrl: string }> {
    return apiFetch<{ labelUrl: string }>(`/admin/orders/${id}/shipment/label`);
  },
};
