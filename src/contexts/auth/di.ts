import { CookieTokenStorage } from "./infrastructure/storage/cookie-token-storage";
import { AuthRepositoryImpl } from "./infrastructure/repositories/auth-repository.impl";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { LogoutUseCase } from "./application/use-cases/logout.use-case";
import { RefreshSessionUseCase } from "./application/use-cases/refresh-session.use-case";
import { GetCurrentUserUseCase } from "./application/use-cases/get-current-user.use-case";

// Infrastructure
const tokenStorage = new CookieTokenStorage();
const authRepository = new AuthRepositoryImpl();

// Use cases
export const loginUseCase = new LoginUseCase(authRepository, tokenStorage);
export const logoutUseCase = new LogoutUseCase(tokenStorage);
export const refreshSessionUseCase = new RefreshSessionUseCase(authRepository, tokenStorage);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(tokenStorage);
