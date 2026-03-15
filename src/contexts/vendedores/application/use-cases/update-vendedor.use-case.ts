import { Vendedor } from "../../domain/entities/vendedor";
import {
  UpdateVendedorParams,
  VendedorRepository,
} from "../../domain/repositories/vendedor-repository.interface";

export class UpdateVendedorUseCase {
  constructor(private readonly repository: VendedorRepository) {}

  async execute(id: string, params: UpdateVendedorParams): Promise<Vendedor> {
    return this.repository.update(id, params);
  }
}
