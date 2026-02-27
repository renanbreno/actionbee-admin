export class AffiliateInvalidTokenError extends Error {
  constructor(message = 'Token de recuperação inválido') {
    super(message);
    this.name = 'AffiliateInvalidTokenError';
  }
}
