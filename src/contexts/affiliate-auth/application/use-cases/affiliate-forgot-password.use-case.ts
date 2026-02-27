export class AffiliateForgotPasswordUseCase {
  constructor(private readonly authRepository: AffiliateAuthRepository) {}

  async execute(dto: { email: string }): Promise<{ message: string }> {
    return this.authRepository.forgotPassword(dto.email);
  }
}
