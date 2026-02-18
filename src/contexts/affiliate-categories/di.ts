import { AffiliateCategoryRepositoryImpl } from "./infrastructure/repositories/affiliate-category-repository.impl";
import { GetAllAffiliateCategoriesUseCase } from "./application/use-cases/get-all-affiliate-categories.use-case";
import { GetAffiliateCategoryByIdUseCase } from "./application/use-cases/get-affiliate-category-by-id.use-case";
import { CreateAffiliateCategoryUseCase } from "./application/use-cases/create-affiliate-category.use-case";
import { UpdateAffiliateCategoryUseCase } from "./application/use-cases/update-affiliate-category.use-case";
import { DeleteAffiliateCategoryUseCase } from "./application/use-cases/delete-affiliate-category.use-case";

const affiliateCategoryRepository = new AffiliateCategoryRepositoryImpl();

export const getAllAffiliateCategoriesUseCase = new GetAllAffiliateCategoriesUseCase(
  affiliateCategoryRepository
);
export const getAffiliateCategoryByIdUseCase = new GetAffiliateCategoryByIdUseCase(
  affiliateCategoryRepository
);
export const createAffiliateCategoryUseCase = new CreateAffiliateCategoryUseCase(
  affiliateCategoryRepository
);
export const updateAffiliateCategoryUseCase = new UpdateAffiliateCategoryUseCase(
  affiliateCategoryRepository
);
export const deleteAffiliateCategoryUseCase = new DeleteAffiliateCategoryUseCase(
  affiliateCategoryRepository
);
