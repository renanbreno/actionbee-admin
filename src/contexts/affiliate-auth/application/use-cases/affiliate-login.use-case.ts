import { AffiliateUser } from '../../domain/entities/affiliate-user';
import { AffiliateAuthRepository } from '../../domain/repositories/affiliate-auth-repository.interface';
import { AffiliateTokenStoragePort } from '../ports/affiliate-token-storage.port';

export class AffiliateLoginUseCase {
  constructor(
    private readonly authRepository: AffiliateAuthRepository,
    private readonly tokenStorage: AffiliateTokenStoragePort,
  ) {}

  async execute(dto: { cpf: string; password: string }): Promise<AffiliateUser> {
    const { affiliate, tokens } = await this.authRepository.login(dto.cpf, dto.password);
    await this.tokenStorage.save(tokens);
    await this.tokenStorage.saveAffiliate({
      id: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
    });
    return affiliate;
  }
}
