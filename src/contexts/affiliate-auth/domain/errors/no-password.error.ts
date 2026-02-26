export class AffiliateNoPasswordError extends Error {
  readonly code = 'NO_PASSWORD';
  constructor() {
    super('Senha não cadastrada');
  }
}
