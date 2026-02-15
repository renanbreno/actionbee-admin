import { Category } from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repositories/category-repository.interface";

export class GetCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.repository.getAll();
  }
}
