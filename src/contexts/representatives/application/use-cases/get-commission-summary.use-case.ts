import { CommissionSummary } from "../../domain/entities/commission-summary";
import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";

export class GetCommissionSummaryUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(): Promise<CommissionSummary> {
    return this.repository.getCommissionSummary();
  }
}
