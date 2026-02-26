export type ShipmentStatus = "PENDING" | "SHIPPED" | "DELIVERED";

export interface ShipmentItem {
  id?: string;
  productId?: string;    // present only for variant items
  variantId?: string;    // present only for variant items
  giftTierId?: string;   // present only for gift items
  productName: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  unitsPerVariant?: number;
}

export interface AffiliateShipment {
  id: string;
  affiliateId: string;
  referenceMonth: string; // "2026-02"
  status: ShipmentStatus;
  items: ShipmentItem[];
  totalCost?: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyReportSummary {
  totalAffiliates: number;
  totalShipments: number;
  totalItemsSent: number;
  totalCost: number;
}

export interface MonthlyReportAffiliate {
  affiliateId: string;
  affiliateName: string;
  categoryName: string;
  shipmentsCount: number;
  totalItemsSent: number;
  totalCost: number;
}

export interface MonthlyReport {
  month: string;
  summary: MonthlyReportSummary;
  affiliates: MonthlyReportAffiliate[];
}
