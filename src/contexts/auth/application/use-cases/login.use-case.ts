import { AdminUser } from "../../domain/entities/admin-user";
import { AuthRepository } from "../../domain/repositories/auth-repository.interface";
import { TokenStoragePort } from "../ports/token-storage.port";

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenStorage: TokenStoragePort,
  ) {}

  async execute(dto: { email: string; password: string }): Promise<AdminUser> {
    const deviceId = this.tokenStorage.getDeviceId();
    const { admin, tokens } = await this.authRepository.login(
      dto.email,
      dto.password,
      deviceId,
    );
    await this.tokenStorage.save(tokens);
    await this.tokenStorage.saveAdmin({
      id: admin.id,
      name: admin.name,
      email: admin.email.toString(),
      role: admin.role,
      permissions: admin.permissions,
    });
    return admin;
  }
}
