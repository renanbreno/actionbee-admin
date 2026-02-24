import { apiFetch } from "@/shared/infrastructure/api/api-client";
import {
  AffiliateShipment,
  MonthlyReport,
  ShipmentStatus,
} from "../../domain/entities/affiliate-shipment";
import { CreateShipmentDTO } from "../../domain/repositories/affiliate-shipment-repository.interface";

export const affiliateShipmentsApiClient = {
  getByAffiliate(
    affiliateId: string,
    month?: string,
  ): Promise<AffiliateShipment[]> {
    const params = month ? `?month=${month}` : "";
    return apiFetch<AffiliateShipment[]>(
      `/admin/affiliates/${affiliateId}/shipments${params}`,
    );
  },

  create(
    affiliateId: string,
    data: CreateShipmentDTO,
  ): Promise<AffiliateShipment> {
    return apiFetch<AffiliateShipment>(
      `/admin/affiliates/${affiliateId}/shipments`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  updateStatus(
    affiliateId: string,
    shipmentId: string,
    status: ShipmentStatus,
  ): Promise<AffiliateShipment> {
    return apiFetch<AffiliateShipment>(
      `/admin/affiliates/${affiliateId}/shipments/${shipmentId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );
  },

  delete(affiliateId: string, shipmentId: string): Promise<void> {
    return apiFetch<void>(
      `/admin/affiliates/${affiliateId}/shipments/${shipmentId}`,
      {
        method: "DELETE",
      },
    );
  },

  getMonthlyReport(month: string): Promise<MonthlyReport> {
    return apiFetch<MonthlyReport>(
      `/admin/affiliates/shipments/report?month=${month}`,
    );
  },
};
