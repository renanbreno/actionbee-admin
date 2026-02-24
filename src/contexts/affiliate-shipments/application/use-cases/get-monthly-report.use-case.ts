import { MonthlyReport } from "../../domain/entities/affiliate-shipment";
import { AffiliateShipmentRepository } from "../../domain/repositories/affiliate-shipment-repository.interface";

export class GetMonthlyReportUseCase {
  constructor(private readonly repository: AffiliateShipmentRepository) {}

  async execute(month: string): Promise<MonthlyReport> {
    return this.repository.getMonthlyReport(month);
  }
}
