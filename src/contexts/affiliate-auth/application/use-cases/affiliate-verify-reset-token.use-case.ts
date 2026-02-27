export class AffiliateVerifyResetTokenUseCase {
  constructor(private readonly authRepository: AffiliateAuthRepository) {}

  async execute(token: string): Promise<{ valid: boolean; email: string }> {
    return this.authRepository.verifyResetToken(token);
  }
}
