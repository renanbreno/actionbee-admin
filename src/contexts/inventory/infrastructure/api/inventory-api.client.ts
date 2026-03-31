import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { ProductBatch } from "../../domain/entities/product-batch";
import { PaginatedMovements } from "../../domain/entities/stock-movement";
import { AddStockEntryDTO } from "../../application/dto/add-stock-entry.dto";
import { AddStockAdjustmentDTO } from "../../application/dto/add-stock-adjustment.dto";

export const inventoryApiClient = {
  getBatches(productId: string, includeInactive = false): Promise<ProductBatch[]> {
    const params = new URLSearchParams();
    if (includeInactive) params.set("includeInactive", "true");
    return apiFetch(`/admin/inventory/products/${productId}/batches?${params}`);
  },

  getMovements(productId: string, page = 1, limit = 20): Promise<PaginatedMovements> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiFetch(`/admin/inventory/products/${productId}/movements?${params}`);
  },

  addStockEntry(productId: string, dto: AddStockEntryDTO): Promise<ProductBatch> {
    return apiFetch(`/admin/inventory/products/${productId}/stock-entry`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  addStockAdjustment(productId: string, dto: AddStockAdjustmentDTO): Promise<void> {
    return apiFetch(`/admin/inventory/products/${productId}/stock-adjustment`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};
