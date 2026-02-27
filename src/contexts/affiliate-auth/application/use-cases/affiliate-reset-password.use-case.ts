import { AffiliateAuthRepository } from '../../domain/repositories/affiliate-auth-repository.interface';

export class AffiliateResetPasswordUseCase {
  constructor(private readonly authRepository: AffiliateAuthRepository) {}

  async execute(dto: { token: string; password: string }): Promise<{ message: string }> {
    return this.authRepository.resetPassword(dto.token, dto.password);
  }
}
