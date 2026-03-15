import { PaginatedVendedorSalesReport, VendedorSalesReportFilters } from "../../domain/entities/sales-report";
import { VendedorRepository } from "../../domain/repositories/vendedor-repository.interface";

export class GetVendedorSalesReportUseCase {
  constructor(private readonly repository: VendedorRepository) {}

  async execute(filters: VendedorSalesReportFilters): Promise<PaginatedVendedorSalesReport> {
    return this.repository.getSalesReport(filters);
  }
}
