import { Vendedor } from "../../domain/entities/vendedor";
import {
  CreateVendedorParams,
  VendedorRepository,
} from "../../domain/repositories/vendedor-repository.interface";

export class CreateVendedorUseCase {
  constructor(private readonly repository: VendedorRepository) {}

  async execute(params: CreateVendedorParams): Promise<Vendedor> {
    return this.repository.create(params);
  }
}
