import { BrandRepository } from "../../domain/repositories/brand-repository.interface";
import { Brand } from "../../domain/entities/brand";

export class GetBrandByIdUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string): Promise<Brand> {
    return this.brandRepository.getById(id);
  }
}
