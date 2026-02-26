import {
  AffiliateShipment,
  MonthlyReport,
  ShipmentStatus,
} from "../entities/affiliate-shipment";

export interface CreateShipmentItemDTO {
  variantId?: string;
  giftTierId?: string;
  quantity: number;
}

export interface CreateShipmentDTO {
  referenceMonth: string;
  notes?: string | null;
  items: CreateShipmentItemDTO[];
}

export interface AffiliateShipmentRepository {
  getByAffiliate(
    affiliateId: string,
    month?: string,
  ): Promise<AffiliateShipment[]>;
  create(
    affiliateId: string,
    data: CreateShipmentDTO,
  ): Promise<AffiliateShipment>;
  updateStatus(
    affiliateId: string,
    shipmentId: string,
    status: ShipmentStatus,
  ): Promise<AffiliateShipment>;
  delete(affiliateId: string, shipmentId: string): Promise<void>;
  getMonthlyReport(month: string): Promise<MonthlyReport>;
}
