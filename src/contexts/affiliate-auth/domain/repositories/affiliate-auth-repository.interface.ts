import { AffiliateUser } from '../entities/affiliate-user';
import { TokenPair } from '../value-objects/token-pair';

export interface AffiliateAuthRepository {
  login(cpf: string, password: string): Promise<{ affiliate: AffiliateUser; tokens: TokenPair }>;
  setupPassword(cpf: string, password: string): Promise<{ affiliate: AffiliateUser; tokens: TokenPair }>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(token: string, password: string): Promise<{ message: string }>;
  verifyResetToken(token: string): Promise<{ valid: boolean; email: string }>;
}
