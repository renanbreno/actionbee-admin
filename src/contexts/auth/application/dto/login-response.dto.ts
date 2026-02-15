import { AdminUser } from "../../domain/entities/admin-user";
import { TokenPair } from "../../domain/value-objects/token-pair";

export interface LoginResponseDto {
  admin: AdminUser;
  tokens: TokenPair;
}
