import { Category } from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repositories/category-repository.interface";
import { UpdateCategoryDto } from "../dto/update-category.dto";

export class UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<Category> {
    return this.repository.update(id, dto);
  }
}
