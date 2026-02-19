import { Product } from "../../domain/entities/product";
import {
  CreateProductDTO,
  ProductRepository,
} from "../../domain/repositories/product-repository.interface";

export class CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(
    data: CreateProductDTO,
    images: File[],
    nutritionalTableImage?: File,
  ): Promise<Product> {
    return this.repository.create(data, images, nutritionalTableImage);
  }
}
