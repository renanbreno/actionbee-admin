import { OrderRepositoryImpl } from "./infrastructure/repositories/order-repository.impl";
import { GetOrdersUseCase } from "./application/use-cases/get-orders.use-case";
import { GetOrderDetailUseCase } from "./application/use-cases/get-order-detail.use-case";
import { CreateOrderUseCase } from "./application/use-cases/create-order.use-case";
import { UpdateOrderStatusUseCase } from "./application/use-cases/update-order-status.use-case";

const orderRepository = new OrderRepositoryImpl();

export const getOrdersUseCase = new GetOrdersUseCase(orderRepository);
export const getOrderDetailUseCase = new GetOrderDetailUseCase(orderRepository);
export const createOrderUseCase = new CreateOrderUseCase(orderRepository);
export const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
