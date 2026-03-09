import { PaginatedSalesReport, SalesReportFilters } from "../../domain/entities/sales-report";
import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";

export class GetSalesReportUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(filters: SalesReportFilters): Promise<PaginatedSalesReport> {
    return this.repository.getSalesReport(filters);
  }
}
