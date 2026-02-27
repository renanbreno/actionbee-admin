import { AffiliateUser } from '../../domain/entities/affiliate-user';
import { TokenPair } from '../../domain/value-objects/token-pair';
import { AffiliateAuthRepository } from '../../domain/repositories/affiliate-auth-repository.interface';
import { affiliateAuthApiClient } from '../api/affiliate-auth-api.client';

function toResult(raw: { accessToken: string; affiliate: { id: string; name: string; email: string } }): { affiliate: AffiliateUser; tokens: TokenPair } {
  return {
    affiliate: {
      id: raw.affiliate.id,
      name: raw.affiliate.name,
      email: raw.affiliate.email,
    },
    tokens: {
      accessToken: raw.accessToken,
    },
  };
}

export class AffiliateAuthRepositoryImpl implements AffiliateAuthRepository {
  async login(cpf: string, password: string): Promise<{ affiliate: AffiliateUser; tokens: TokenPair }> {
    const raw = await affiliateAuthApiClient.login(cpf, password);
    return toResult(raw);
  }

  async setupPassword(cpf: string, password: string): Promise<{ affiliate: AffiliateUser; tokens: TokenPair }> {
    const raw = await affiliateAuthApiClient.setupPassword(cpf, password);
    return toResult(raw);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return affiliateAuthApiClient.forgotPassword(email);
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return affiliateAuthApiClient.resetPassword(token, password);
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean; email: string }> {
    return affiliateAuthApiClient.verifyResetToken(token);
  }
}
