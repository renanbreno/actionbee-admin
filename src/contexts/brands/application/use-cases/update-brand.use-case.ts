import { BrandRepository, UpdateBrandDTO } from "../../domain/repositories/brand-repository.interface";
import { Brand } from "../../domain/entities/brand";

export class UpdateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string, data: UpdateBrandDTO): Promise<Brand> {
    return this.brandRepository.update(id, data);
  }
}
