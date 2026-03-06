import { OrderDetail, OrderListItem, PaginatedOrders } from "../entities/order";
import { CreateOrderDTO } from "../../application/dto/create-order.dto";

export interface GetOrdersFilters {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export type CreateOrderParams = CreateOrderDTO;

export interface UpdateOrderStatusParams {
  status: string;
  trackingCode?: string;
  cancellationReason?: string;
}

export interface OrderRepository {
  getAll(filters: GetOrdersFilters): Promise<PaginatedOrders>;
  getById(id: string): Promise<OrderDetail>;
  create(params: CreateOrderParams): Promise<OrderListItem>;
  updateStatus(id: string, params: UpdateOrderStatusParams): Promise<void>;
}
