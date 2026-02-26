import { AffiliateUser } from '../../domain/entities/affiliate-user';
import { AffiliateTokenStoragePort } from '../ports/affiliate-token-storage.port';

export class GetCurrentAffiliateUserUseCase {
  constructor(private readonly tokenStorage: AffiliateTokenStoragePort) {}

  async execute(): Promise<AffiliateUser | null> {
    const accessToken = await this.tokenStorage.getAccessToken();
    if (!accessToken) return null;

    const stored = await this.tokenStorage.getAffiliate();
    if (!stored) return null;

    return {
      id: stored.id,
      name: stored.name,
      email: stored.email,
    };
  }
}
