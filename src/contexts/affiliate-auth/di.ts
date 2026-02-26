import { AffiliateTokenStorage } from './infrastructure/storage/affiliate-token-storage';
import { AffiliateAuthRepositoryImpl } from './infrastructure/repositories/affiliate-auth-repository.impl';
import { AffiliateLoginUseCase } from './application/use-cases/affiliate-login.use-case';
import { AffiliateLogoutUseCase } from './application/use-cases/affiliate-logout.use-case';
import { AffiliateSetupPasswordUseCase } from './application/use-cases/affiliate-setup-password.use-case';
import { GetCurrentAffiliateUserUseCase } from './application/use-cases/get-current-affiliate-user.use-case';

// Infrastructure
const tokenStorage = new AffiliateTokenStorage();
const authRepository = new AffiliateAuthRepositoryImpl();

// Use cases
export const affiliateLoginUseCase = new AffiliateLoginUseCase(authRepository, tokenStorage);
export const affiliateLogoutUseCase = new AffiliateLogoutUseCase(tokenStorage);
export const affiliateSetupPasswordUseCase = new AffiliateSetupPasswordUseCase(authRepository, tokenStorage);
export const getCurrentAffiliateUserUseCase = new GetCurrentAffiliateUserUseCase(tokenStorage);
