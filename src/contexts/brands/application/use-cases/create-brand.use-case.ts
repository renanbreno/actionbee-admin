import { BrandRepository, CreateBrandDTO } from "../../domain/repositories/brand-repository.interface";
import { Brand } from "../../domain/entities/brand";

export class CreateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(data: CreateBrandDTO): Promise<Brand> {
    return this.brandRepository.create(data);
  }
}
