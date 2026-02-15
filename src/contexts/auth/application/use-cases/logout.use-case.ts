import { TokenStoragePort } from "../ports/token-storage.port";

export class LogoutUseCase {
  constructor(private readonly tokenStorage: TokenStoragePort) {}

  async execute(): Promise<void> {
    await this.tokenStorage.clear();
  }
}
