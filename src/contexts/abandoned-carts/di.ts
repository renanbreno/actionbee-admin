import { AbandonedCartRepositoryImpl } from "./infrastructure/repositories/abandoned-cart-repository.impl";
import { GetAbandonedCartsUseCase } from "./application/use-cases/get-abandoned-carts.use-case";

const abandonedCartRepository = new AbandonedCartRepositoryImpl();

export const getAbandonedCartsUseCase = new GetAbandonedCartsUseCase(abandonedCartRepository);
