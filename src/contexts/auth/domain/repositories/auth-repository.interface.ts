import { AdminUser } from "../entities/admin-user";
import { TokenPair } from "../value-objects/token-pair";

export interface AuthRepository {
  login(email: string, password: string, deviceId: string): Promise<{ admin: AdminUser; tokens: TokenPair }>;
  refreshToken(refreshToken: string, deviceId: string): Promise<TokenPair>;
}
