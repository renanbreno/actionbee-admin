import { OrderDetail, OrderListItem, PaginatedOrders } from "../../domain/entities/order";
import {
  CreateOrderParams,
  CreateShipmentResult,
  GetOrdersFilters,
  OrderRepository,
  UpdateOrderParams,
  UpdateOrderPaymentStatusParams,
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

  update(id: string, params: UpdateOrderParams): Promise<OrderDetail> {
    return ordersApiClient.update(id, params);
  }

  updateStatus(id: string, params: UpdateOrderStatusParams): Promise<void> {
    return ordersApiClient.updateStatus(id, params);
  }

  updatePaymentStatus(id: string, params: UpdateOrderPaymentStatusParams): Promise<void> {
    return ordersApiClient.updatePaymentStatus(id, params);
  }

  createShipment(id: string): Promise<CreateShipmentResult> {
    return ordersApiClient.createShipment(id);
  }

  getShipmentLabel(id: string): Promise<{ labelUrl: string }> {
    return ordersApiClient.getShipmentLabel(id);
  }
}
