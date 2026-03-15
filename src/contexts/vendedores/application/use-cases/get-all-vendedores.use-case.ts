import { Vendedor } from "../../domain/entities/vendedor";
import { VendedorRepository } from "../../domain/repositories/vendedor-repository.interface";

export class GetAllVendedoresUseCase {
  constructor(private readonly repository: VendedorRepository) {}

  async execute(name?: string): Promise<Vendedor[]> {
    return this.repository.getAll(name);
  }
}
