import { Category } from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repositories/category-repository.interface";
import { CreateCategoryDto } from "../dto/create-category.dto";

export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    return this.repository.create(dto);
  }
}
