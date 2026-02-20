import { BrandRepository } from "../../domain/repositories/brand-repository.interface";
import { Brand } from "../../domain/entities/brand";

export class GetAllBrandsUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(): Promise<Brand[]> {
    return this.brandRepository.getAll();
  }
}
