import { Product } from "../../domain/entities/product";
import {
  ProductRepository,
  UpdateProductDTO,
} from "../../domain/repositories/product-repository.interface";

export class UpdateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(
    id: string,
    data: UpdateProductDTO,
    images?: File[],
    nutritionalTableImage?: File,
  ): Promise<Product> {
    return this.repository.update(id, data, images, nutritionalTableImage);
  }
}
