import { AuthRepository } from "../../domain/repositories/auth-repository.interface";
import { SessionExpiredError } from "../../domain/errors/session-expired.error";
import { TokenStoragePort } from "../ports/token-storage.port";

export class RefreshSessionUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenStorage: TokenStoragePort,
  ) {}

  async execute(): Promise<void> {
    const refreshToken = await this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new SessionExpiredError();
    }

    const deviceId = this.tokenStorage.getDeviceId();
    const newTokens = await this.authRepository.refreshToken(refreshToken, deviceId);
    await this.tokenStorage.save(newTokens);
  }
}
