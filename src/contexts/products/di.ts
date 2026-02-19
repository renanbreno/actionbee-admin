import { ProductRepositoryImpl } from "./infrastructure/repositories/product-repository.impl";
import { GetAllProductsUseCase } from "./application/use-cases/get-all-products.use-case";
import { GetProductByIdUseCase } from "./application/use-cases/get-product-by-id.use-case";
import { CreateProductUseCase } from "./application/use-cases/create-product.use-case";
import { UpdateProductUseCase } from "./application/use-cases/update-product.use-case";
import { SetRelatedProductsUseCase } from "./application/use-cases/set-related-products.use-case";
import { GetRelatedProductsUseCase } from "./application/use-cases/get-related-products.use-case";

const productRepository = new ProductRepositoryImpl();

export const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
export const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
export const createProductUseCase = new CreateProductUseCase(productRepository);
export const updateProductUseCase = new UpdateProductUseCase(productRepository);
export const getRelatedProductsUseCase = new GetRelatedProductsUseCase(productRepository);
export const setRelatedProductsUseCase = new SetRelatedProductsUseCase(productRepository);
