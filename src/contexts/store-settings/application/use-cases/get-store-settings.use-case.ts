import { StoreSettings } from "../../domain/entities/store-settings";
import { StoreSettingsRepository } from "../../domain/repositories/store-settings-repository.interface";

export class GetStoreSettingsUseCase {
  constructor(private readonly repository: StoreSettingsRepository) {}

  async execute(): Promise<StoreSettings | null> {
    return this.repository.get();
  }
}
