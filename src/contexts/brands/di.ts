import { BrandRepositoryImpl } from "./infrastructure/repositories/brand-repository.impl";
import { GetAllBrandsUseCase } from "./application/use-cases/get-all-brands.use-case";
import { GetBrandByIdUseCase } from "./application/use-cases/get-brand-by-id.use-case";
import { CreateBrandUseCase } from "./application/use-cases/create-brand.use-case";
import { UpdateBrandUseCase } from "./application/use-cases/update-brand.use-case";
import { DeleteBrandUseCase } from "./application/use-cases/delete-brand.use-case";

const brandRepository = new BrandRepositoryImpl();

export const getAllBrandsUseCase = new GetAllBrandsUseCase(brandRepository);
export const getBrandByIdUseCase = new GetBrandByIdUseCase(brandRepository);
export const createBrandUseCase = new CreateBrandUseCase(brandRepository);
export const updateBrandUseCase = new UpdateBrandUseCase(brandRepository);
export const deleteBrandUseCase = new DeleteBrandUseCase(brandRepository);
