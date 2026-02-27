export class AffiliateTokenExpiredError extends Error {
  constructor(message = 'Token de recuperação expirado') {
    super(message);
    this.name = 'AffiliateTokenExpiredError';
  }
}
