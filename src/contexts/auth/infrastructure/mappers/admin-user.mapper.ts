import { AdminUser } from "../../domain/entities/admin-user";
import { Email } from "../../domain/value-objects/email";
import { TokenPair } from "../../domain/value-objects/token-pair";
import { Role } from "../../domain/value-objects/role";
import { AuthApiLoginResponse } from "../api/auth-api.client";

export class AdminUserMapper {
  static toDomain(raw: AuthApiLoginResponse): { admin: AdminUser; tokens: TokenPair } {
    return {
      admin: {
        id: raw.admin.id,
        email: Email.create(raw.admin.email),
        name: raw.admin.name,
        role: raw.admin.role as Role,
      },
      tokens: {
        accessToken: raw.accessToken,
        refreshToken: raw.refreshToken,
      },
    };
  }
}
