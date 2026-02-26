import { AffiliateUser } from '../entities/affiliate-user';
import { TokenPair } from '../value-objects/token-pair';

export interface AffiliateAuthRepository {
  login(cpf: string, password: string): Promise<{ affiliate: AffiliateUser; tokens: TokenPair }>;
  setupPassword(cpf: string, password: string): Promise<{ affiliate: AffiliateUser; tokens: TokenPair }>;
}
