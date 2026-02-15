import { AdminUser } from "../../domain/entities/admin-user";
import { TokenPair } from "../../domain/value-objects/token-pair";
import { AuthRepository } from "../../domain/repositories/auth-repository.interface";
import { authApiClient } from "../api/auth-api.client";
import { AdminUserMapper } from "../mappers/admin-user.mapper";

export class AuthRepositoryImpl implements AuthRepository {
  async login(email: string, password: string, deviceId: string): Promise<{ admin: AdminUser; tokens: TokenPair }> {
    const raw = await authApiClient.login(email, password, deviceId);
    return AdminUserMapper.toDomain(raw);
  }

  async refreshToken(refreshToken: string, deviceId: string): Promise<TokenPair> {
    const raw = await authApiClient.refresh(refreshToken, deviceId);
    return {
      accessToken: raw.accessToken,
      refreshToken: raw.refreshToken,
    };
  }
}
