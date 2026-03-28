import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { PaginatedGiftMovements } from "../../domain/entities/gift-stock-movement";
import { AddGiftStockEntryDTO } from "../../application/dto/add-gift-stock-entry.dto";
import { AddGiftStockAdjustmentDTO } from "../../application/dto/add-gift-stock-adjustment.dto";

export const giftInventoryApiClient = {
  getMovements(giftTierId: string, page = 1, limit = 20): Promise<PaginatedGiftMovements> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiFetch(`/admin/gift-tiers/${giftTierId}/stock-movements?${params}`);
  },

  addStockEntry(giftTierId: string, dto: AddGiftStockEntryDTO): Promise<void> {
    return apiFetch(`/admin/gift-tiers/${giftTierId}/stock-entry`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  addStockAdjustment(giftTierId: string, dto: AddGiftStockAdjustmentDTO): Promise<void> {
    return apiFetch(`/admin/gift-tiers/${giftTierId}/stock-adjustment`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};
