import { ProductGroupRepositoryImpl } from "./infrastructure/repositories/product-group-repository.impl";
import { GetProductGroupsUseCase } from "./application/use-cases/get-product-groups.use-case";
import { CreateProductGroupUseCase } from "./application/use-cases/create-product-group.use-case";
import { UpdateProductGroupUseCase } from "./application/use-cases/update-product-group.use-case";
import { DeleteProductGroupUseCase } from "./application/use-cases/delete-product-group.use-case";

const productGroupRepository = new ProductGroupRepositoryImpl();

export const getProductGroupsUseCase = new GetProductGroupsUseCase(productGroupRepository);
export const createProductGroupUseCase = new CreateProductGroupUseCase(productGroupRepository);
export const updateProductGroupUseCase = new UpdateProductGroupUseCase(productGroupRepository);
export const deleteProductGroupUseCase = new DeleteProductGroupUseCase(productGroupRepository);
