# Auth Context — Clean Architecture Documentation

## 1. Responsibility

The **Auth** context owns everything related to administrator identity and access control:

- Login / Logout flows
- Token management (access + refresh)
- Session persistence and rehydration
- Route protection (guards)
- Role-based access control (RBAC)
- Password reset flow

It is the **only context allowed to know** how authentication works. Every other context consumes auth state through a well-defined public API — never by reaching into Auth internals.

---

## 2. Folder Structure

```
src/
└── contexts/
    └── auth/
        ├── domain/
        │   ├── entities/
        │   │   └── admin-user.ts
        │   ├── value-objects/
        │   │   ├── email.ts
        │   │   ├── role.ts
        │   │   └── token-pair.ts
        │   ├── repositories/
        │   │   └── auth-repository.interface.ts
        │   └── errors/
        │       ├── invalid-credentials.error.ts
        │       └── session-expired.error.ts
        │
        ├── application/
        │   ├── use-cases/
        │   │   ├── login.use-case.ts
        │   │   ├── logout.use-case.ts
        │   │   ├── refresh-session.use-case.ts
        │   │   └── get-current-user.use-case.ts
        │   ├── ports/
        │   │   └── token-storage.port.ts
        │   └── dto/
        │       ├── login-request.dto.ts
        │       └── login-response.dto.ts
        │
        ├── infrastructure/
        │   ├── api/
        │   │   └── auth-api.client.ts
        │   ├── repositories/
        │   │   └── auth-repository.impl.ts
        │   ├── storage/
        │   │   └── cookie-token-storage.ts
        │   └── mappers/
        │       └── admin-user.mapper.ts
        │
        └── presentation/
            ├── components/
            │   ├── login-form.tsx
            │   └── protected-route.tsx
            ├── hooks/
            │   ├── use-login.ts
            │   ├── use-logout.ts
            │   └── use-auth.ts
            ├── providers/
            │   └── auth-provider.tsx
            ├── schemas/
            │   └── login.schema.ts
            └── pages/
                └── login-page.tsx
```

---

## 3. Domain Layer

The domain layer is **pure TypeScript** — zero framework imports.

### Entities

```ts
// domain/entities/admin-user.ts
export interface AdminUser {
  readonly id: string;
  readonly email: Email;
  readonly name: string;
  readonly role: Role;
}
```

### Value Objects

```ts
// domain/value-objects/email.ts
export class Email {
  private constructor(private readonly value: string) {}

  static create(raw: string): Email {
    const trimmed = raw.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new InvalidEmailError(raw);
    }
    return new Email(trimmed);
  }

  toString(): string {
    return this.value;
  }
}

// domain/value-objects/role.ts
export type Role = "super_admin" | "admin" | "editor" | "viewer";

// domain/value-objects/token-pair.ts
export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}
```

### Repository Interface (Port)

```ts
// domain/repositories/auth-repository.interface.ts
export interface AuthRepository {
  login(email: string, password: string): Promise<{ user: AdminUser; tokens: TokenPair }>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<TokenPair>;
  getCurrentUser(): Promise<AdminUser>;
}
```

### Domain Errors

```ts
// domain/errors/invalid-credentials.error.ts
export class InvalidCredentialsError extends Error {
  readonly code = "INVALID_CREDENTIALS";
  constructor() {
    super("Invalid email or password");
  }
}
```

---

## 4. Application Layer

Orchestrates domain objects. No framework code, no direct HTTP calls.

### Use Cases

```ts
// application/use-cases/login.use-case.ts
export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenStorage: TokenStoragePort,
  ) {}

  async execute(dto: LoginRequestDto): Promise<AdminUser> {
    const { user, tokens } = await this.authRepository.login(
      dto.email,
      dto.password,
    );
    await this.tokenStorage.save(tokens);
    return user;
  }
}
```

### Ports

```ts
// application/ports/token-storage.port.ts
export interface TokenStoragePort {
  save(tokens: TokenPair): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  clear(): Promise<void>;
}
```

### DTOs

```ts
// application/dto/login-request.dto.ts
export interface LoginRequestDto {
  email: string;
  password: string;
}

// application/dto/login-response.dto.ts
export interface LoginResponseDto {
  user: AdminUser;
  tokens: TokenPair;
}
```

---

## 5. Infrastructure Layer

Implements the ports using concrete technologies.

### API Client

```ts
// infrastructure/api/auth-api.client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const authApiClient = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((res) => {
      if (!res.ok) throw new InvalidCredentialsError();
      return res.json();
    }),

  refresh: (refreshToken: string) =>
    fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).then((res) => res.json()),

  me: (accessToken: string) =>
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json()),
};
```

### Repository Implementation

```ts
// infrastructure/repositories/auth-repository.impl.ts
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly api: typeof authApiClient) {}

  async login(email: string, password: string) {
    const raw = await this.api.login(email, password);
    return AdminUserMapper.toDomain(raw);
  }

  // ... other methods delegate to api + mapper
}
```

### Token Storage (Cookie-based)

```ts
// infrastructure/storage/cookie-token-storage.ts
import Cookies from "js-cookie";

export class CookieTokenStorage implements TokenStoragePort {
  private static readonly ACCESS_KEY = "ab_access_token";
  private static readonly REFRESH_KEY = "ab_refresh_token";

  async save(tokens: TokenPair): Promise<void> {
    Cookies.set(CookieTokenStorage.ACCESS_KEY, tokens.accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set(CookieTokenStorage.REFRESH_KEY, tokens.refreshToken, {
      secure: true,
      sameSite: "strict",
    });
  }

  async getAccessToken() {
    return Cookies.get(CookieTokenStorage.ACCESS_KEY) ?? null;
  }

  async getRefreshToken() {
    return Cookies.get(CookieTokenStorage.REFRESH_KEY) ?? null;
  }

  async clear() {
    Cookies.remove(CookieTokenStorage.ACCESS_KEY);
    Cookies.remove(CookieTokenStorage.REFRESH_KEY);
  }
}
```

### Mapper

```ts
// infrastructure/mappers/admin-user.mapper.ts
export class AdminUserMapper {
  static toDomain(raw: any): { user: AdminUser; tokens: TokenPair } {
    return {
      user: {
        id: raw.user.id,
        email: Email.create(raw.user.email),
        name: raw.user.name,
        role: raw.user.role as Role,
      },
      tokens: {
        accessToken: raw.accessToken,
        refreshToken: raw.refreshToken,
      },
    };
  }
}
```

---

## 6. Presentation Layer

The **only layer** that touches React, Next.js, Shadcn/ui, and TanStack Query.

### Zod Schema (form validation)

```ts
// presentation/schemas/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

### Hooks (TanStack Query + Use Cases)

```ts
// presentation/hooks/use-login.ts
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginUseCase.execute(data),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });
}

// presentation/hooks/use-auth.ts
export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => getCurrentUserUseCase.execute(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return { user: user ?? null, isLoading, isAuthenticated: !!user };
}
```

### Auth Provider

```ts
// presentation/providers/auth-provider.tsx
"use client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Protected Route

```ts
// presentation/components/protected-route.tsx
"use client";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
```

---

## 7. Data Flow

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION                                       │
│                                                     │
│  LoginForm  ──(form values)──►  useLogin hook       │
│      ▲                             │                │
│      │                             ▼                │
│  Zod validates                 useMutation          │
│  via React Hook Form           calls use case       │
└────────────────────────────────────┬────────────────┘
                                     │
┌────────────────────────────────────▼────────────────┐
│  APPLICATION                                        │
│                                                     │
│  LoginUseCase.execute(dto)                          │
│      │                                              │
│      ├──► AuthRepository.login(email, password)     │
│      └──► TokenStoragePort.save(tokens)             │
└────────────────────────────────────┬────────────────┘
                                     │
┌────────────────────────────────────▼────────────────┐
│  INFRASTRUCTURE                                     │
│                                                     │
│  AuthRepositoryImpl                                 │
│      │                                              │
│      ├──► authApiClient.login()  →  NestJS backend  │
│      └──► AdminUserMapper.toDomain()                │
│                                                     │
│  CookieTokenStorage.save()  →  browser cookies      │
└─────────────────────────────────────────────────────┘
```

**Dependency rule**: arrows always point **inward**. Presentation depends on Application. Infrastructure depends on Application. Application depends on Domain. Domain depends on **nothing**.

---

## 8. Security Considerations

| Concern | Strategy |
|---|---|
| Token storage | `httpOnly` cookies preferred; fallback to `secure` + `sameSite: strict` cookies via JS |
| XSS | No tokens in `localStorage`; CSP headers configured in `next.config.js` |
| CSRF | `sameSite: strict` cookies + NestJS CSRF guard |
| Token refresh | Silent refresh via interceptor before token expires; redirect to login on failure |
| Route protection | Server-side middleware (`middleware.ts`) checks cookie existence; client-side `ProtectedRoute` checks role |
| Password handling | Never stored client-side; transmitted only over HTTPS; cleared from memory after submission |
| Rate limiting | Handled by NestJS backend; frontend shows appropriate error messages |

---

## 9. Scalability Considerations

| Area | Approach |
|---|---|
| Multi-tenant | Auth context can be extended with `tenantId` in the `AdminUser` entity without touching other contexts |
| SSO / OAuth | Add new use case (`SsoLoginUseCase`) and a new `OAuthApiClient` in infrastructure — domain stays untouched |
| Permissions granularity | Evolve `Role` value object into a `Permission[]` model; `ProtectedRoute` already accepts role checks |
| Token strategy swap | Replace `CookieTokenStorage` with any `TokenStoragePort` implementation (e.g., `HttpOnlyServerStorage` using Next.js server actions) |
| Micro-frontend split | Auth context is fully self-contained and can be extracted into a standalone package |

---

## 10. Example Use Case Flow — Login

**Actor**: Admin user on `/login` page.

```
1. User fills email + password → submits form.
2. React Hook Form validates input against loginSchema (Zod).
3. useLogin hook fires useMutation → calls LoginUseCase.execute({ email, password }).
4. LoginUseCase delegates to AuthRepository.login(email, password).
5. AuthRepositoryImpl calls authApiClient.login() → POST /auth/login to NestJS.
6. NestJS validates credentials, returns { user, accessToken, refreshToken }.
7. AdminUserMapper.toDomain() converts raw JSON → AdminUser entity + TokenPair VO.
8. LoginUseCase calls TokenStoragePort.save(tokens) → CookieTokenStorage writes cookies.
9. LoginUseCase returns AdminUser to the hook.
10. useMutation.onSuccess sets queryClient data for ["auth", "user"].
11. AuthProvider re-renders → user is now authenticated.
12. Router redirects to /dashboard.
```

**Error path**: Step 6 returns 401 → `InvalidCredentialsError` propagates up → `useMutation.onError` → form displays error toast.

---

> **Next context**: Dashboard — awaiting your confirmation.
