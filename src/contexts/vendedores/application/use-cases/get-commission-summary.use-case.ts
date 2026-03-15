import { VendedorCommissionSummary } from "../../domain/entities/commission-summary";
import { VendedorRepository } from "../../domain/repositories/vendedor-repository.interface";

export class GetVendedorCommissionSummaryUseCase {
  constructor(private readonly repository: VendedorRepository) {}

  async execute(): Promise<VendedorCommissionSummary> {
    return this.repository.getCommissionSummary();
  }
}
