import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { StoreSettings } from "../../domain/entities/store-settings";
import { UpdateStoreSettingsParams } from "../../domain/repositories/store-settings-repository.interface";

export const storeSettingsApiClient = {
  get(): Promise<StoreSettings> {
    return apiFetch<StoreSettings>("/admin/store-settings");
  },

  create(data: UpdateStoreSettingsParams): Promise<StoreSettings> {
    return apiFetch<StoreSettings>("/admin/store-settings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(data: UpdateStoreSettingsParams): Promise<StoreSettings> {
    return apiFetch<StoreSettings>("/admin/store-settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
