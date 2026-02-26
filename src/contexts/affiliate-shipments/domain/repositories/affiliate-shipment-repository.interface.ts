import {
  AffiliateShipment,
  MonthlyReport,
  ShipmentStatus,
} from "../entities/affiliate-shipment";

export interface CreateShipmentProductDTO {
  variantId: string;
  quantity: number;
}

export interface CreateShipmentGiftDTO {
  giftTierId: string;
  quantity: number;
}

export interface CreateShipmentDTO {
  referenceMonth: string;
  products?: CreateShipmentProductDTO[];
  gifts?: CreateShipmentGiftDTO[];
  notes?: string | null;
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
