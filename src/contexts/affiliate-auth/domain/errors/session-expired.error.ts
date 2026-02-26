export class AffiliateSessionExpiredError extends Error {
  readonly code = 'SESSION_EXPIRED';
  constructor() {
    super('Sessão expirada. Faça login novamente.');
  }
}
