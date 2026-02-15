import { AdminUser } from "../../domain/entities/admin-user";
import { Email } from "../../domain/value-objects/email";
import { Role } from "../../domain/value-objects/role";
import { TokenStoragePort } from "../ports/token-storage.port";

export class GetCurrentUserUseCase {
  constructor(private readonly tokenStorage: TokenStoragePort) {}

  async execute(): Promise<AdminUser | null> {
    const accessToken = await this.tokenStorage.getAccessToken();
    if (!accessToken) return null;

    const stored = await this.tokenStorage.getAdmin();
    if (!stored) return null;

    return {
      id: stored.id,
      email: Email.create(stored.email),
      name: stored.name,
      role: stored.role as Role,
    };
  }
}
