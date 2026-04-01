import { CommissionSummary } from "../../domain/entities/commission-summary";
import { RepresentativeRepository, SalesReportFilters } from "../../domain/repositories/representative-repository.interface";

export class GetCommissionSummaryUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(filters?: SalesReportFilters): Promise<CommissionSummary> {
    return this.repository.getCommissionSummary(filters);
  }
}
