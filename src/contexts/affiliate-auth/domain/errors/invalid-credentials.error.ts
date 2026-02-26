export class AffiliateInvalidCredentialsError extends Error {
  readonly code = 'INVALID_CREDENTIALS';
  constructor() {
    super('Email ou senha inválidos');
  }
}
