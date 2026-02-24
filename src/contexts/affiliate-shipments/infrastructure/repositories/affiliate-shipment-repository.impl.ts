import {
  AffiliateShipment,
  MonthlyReport,
  ShipmentStatus,
} from "../../domain/entities/affiliate-shipment";
import {
  AffiliateShipmentRepository,
  CreateShipmentDTO,
} from "../../domain/repositories/affiliate-shipment-repository.interface";
import { affiliateShipmentsApiClient } from "../api/affiliate-shipments-api.client";

export class AffiliateShipmentRepositoryImpl
  implements AffiliateShipmentRepository
{
  async getByAffiliate(
    affiliateId: string,
    month?: string,
  ): Promise<AffiliateShipment[]> {
    return affiliateShipmentsApiClient.getByAffiliate(affiliateId, month);
  }

  async create(
    affiliateId: string,
    data: CreateShipmentDTO,
  ): Promise<AffiliateShipment> {
    return affiliateShipmentsApiClient.create(affiliateId, data);
  }

  async updateStatus(
    affiliateId: string,
    shipmentId: string,
    status: ShipmentStatus,
  ): Promise<AffiliateShipment> {
    return affiliateShipmentsApiClient.updateStatus(
      affiliateId,
      shipmentId,
      status,
    );
  }

  async delete(affiliateId: string, shipmentId: string): Promise<void> {
    return affiliateShipmentsApiClient.delete(affiliateId, shipmentId);
  }

  async getMonthlyReport(month: string): Promise<MonthlyReport> {
    return affiliateShipmentsApiClient.getMonthlyReport(month);
  }
}
