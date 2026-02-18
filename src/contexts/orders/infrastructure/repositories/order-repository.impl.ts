import { OrderDetail, OrderListItem, PaginatedOrders } from "../../domain/entities/order";
import {
  CreateOrderParams,
  GetOrdersFilters,
  OrderRepository,
  UpdateOrderStatusParams,
} from "../../domain/repositories/order-repository.interface";
import { ordersApiClient } from "../api/orders-api.client";

export class OrderRepositoryImpl implements OrderRepository {
  getAll(filters: GetOrdersFilters): Promise<PaginatedOrders> {
    return ordersApiClient.getAll(filters);
  }

  getById(id: string): Promise<OrderDetail> {
    return ordersApiClient.getById(id);
  }

  create(params: CreateOrderParams): Promise<OrderListItem> {
    return ordersApiClient.create(params);
  }

  updateStatus(id: string, params: UpdateOrderStatusParams): Promise<void> {
    return ordersApiClient.updateStatus(id, params);
  }
}
