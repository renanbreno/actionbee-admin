import { CategoryRepositoryImpl } from "./infrastructure/repositories/category-repository.impl";
import { GetCategoriesUseCase } from "./application/use-cases/get-categories.use-case";
import { CreateCategoryUseCase } from "./application/use-cases/create-category.use-case";
import { UpdateCategoryUseCase } from "./application/use-cases/update-category.use-case";
import { DeleteCategoryUseCase } from "./application/use-cases/delete-category.use-case";

const categoryRepository = new CategoryRepositoryImpl();

export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
