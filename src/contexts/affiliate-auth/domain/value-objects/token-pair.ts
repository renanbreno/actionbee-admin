// Backend only issues access tokens (no refresh token)
export interface TokenPair {
  readonly accessToken: string;
}
