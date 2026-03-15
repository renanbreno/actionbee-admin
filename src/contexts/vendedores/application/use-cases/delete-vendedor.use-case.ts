import { VendedorRepository } from "../../domain/repositories/vendedor-repository.interface";

export class DeleteVendedorUseCase {
  constructor(private readonly repository: VendedorRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
