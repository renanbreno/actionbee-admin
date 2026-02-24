import { AffiliateShipmentRepositoryImpl } from "./infrastructure/repositories/affiliate-shipment-repository.impl";
import { GetShipmentsByAffiliateUseCase } from "./application/use-cases/get-shipments-by-affiliate.use-case";
import { CreateShipmentUseCase } from "./application/use-cases/create-shipment.use-case";
import { UpdateShipmentStatusUseCase } from "./application/use-cases/update-shipment-status.use-case";
import { DeleteShipmentUseCase } from "./application/use-cases/delete-shipment.use-case";
import { GetMonthlyReportUseCase } from "./application/use-cases/get-monthly-report.use-case";

const affiliateShipmentRepository = new AffiliateShipmentRepositoryImpl();

export const getShipmentsByAffiliateUseCase =
  new GetShipmentsByAffiliateUseCase(affiliateShipmentRepository);
export const createShipmentUseCase = new CreateShipmentUseCase(
  affiliateShipmentRepository,
);
export const updateShipmentStatusUseCase = new UpdateShipmentStatusUseCase(
  affiliateShipmentRepository,
);
export const deleteShipmentUseCase = new DeleteShipmentUseCase(
  affiliateShipmentRepository,
);
export const getMonthlyReportUseCase = new GetMonthlyReportUseCase(
  affiliateShipmentRepository,
);
