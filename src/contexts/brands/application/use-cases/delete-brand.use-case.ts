import { BrandRepository } from "../../domain/repositories/brand-repository.interface";

export class DeleteBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string): Promise<void> {
    return this.brandRepository.delete(id);
  }
}
