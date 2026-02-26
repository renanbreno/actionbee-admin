import { AffiliateTokenStoragePort } from '../ports/affiliate-token-storage.port';

export class AffiliateLogoutUseCase {
  constructor(private readonly tokenStorage: AffiliateTokenStoragePort) {}

  async execute(): Promise<void> {
    await this.tokenStorage.clear();
  }
}
