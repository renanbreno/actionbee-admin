import Cookies from 'js-cookie';
import { AffiliateTokenStoragePort, AffiliateStoredData } from '../../application/ports/affiliate-token-storage.port';
import { TokenPair } from '../../domain/value-objects/token-pair';

const ACCESS_KEY = 'ab_aff_access_token';
const USER_KEY = 'ab_aff_user';

export class AffiliateTokenStorage implements AffiliateTokenStoragePort {
  async save(tokens: TokenPair): Promise<void> {
    Cookies.set(ACCESS_KEY, tokens.accessToken, {
      secure: true,
      sameSite: 'strict',
    });
  }

  async getAccessToken(): Promise<string | null> {
    return Cookies.get(ACCESS_KEY) ?? null;
  }

  async clear(): Promise<void> {
    Cookies.remove(ACCESS_KEY);
    Cookies.remove(USER_KEY);
  }

  async saveAffiliate(affiliate: AffiliateStoredData): Promise<void> {
    Cookies.set(USER_KEY, JSON.stringify(affiliate), {
      secure: true,
      sameSite: 'strict',
    });
  }

  async getAffiliate(): Promise<AffiliateStoredData | null> {
    const raw = Cookies.get(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AffiliateStoredData;
    } catch {
      return null;
    }
  }
}
