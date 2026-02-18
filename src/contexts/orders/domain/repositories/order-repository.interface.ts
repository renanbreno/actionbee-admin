import { OrderDetail, OrderListItem, PaginatedOrders } from "../entities/order";

export interface GetOrdersFilters {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateOrderParams {
  customerId: string;
  items: { productId: string; variantId: string; quantity: number }[];
  paymentMethod: string;
  couponCode?: string;
  shippingAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shippingInfo?: {
    carrier: string;
    service: string;
    price: number;
    deliveryTime: number;
  };
  notes?: string;
}

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
