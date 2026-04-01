import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";
import { SalesReportFilters } from "../../domain/entities/sales-report";

export class DownloadSalesReportPdfUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(filters: SalesReportFilters): Promise<Blob> {
    return this.repository.downloadSalesReportPdf(filters);
  }
}
