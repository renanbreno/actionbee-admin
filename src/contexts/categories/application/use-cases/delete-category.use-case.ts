import { CategoryRepository } from "../../domain/repositories/category-repository.interface";

export class DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
