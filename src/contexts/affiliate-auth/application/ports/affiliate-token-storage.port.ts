import { TokenPair } from '../../domain/value-objects/token-pair';

export interface AffiliateStoredData {
  id: string;
  name: string;
  email: string;
}

export interface AffiliateTokenStoragePort {
  save(tokens: TokenPair): Promise<void>;
  getAccessToken(): Promise<string | null>;
  clear(): Promise<void>;
  saveAffiliate(affiliate: AffiliateStoredData): Promise<void>;
  getAffiliate(): Promise<AffiliateStoredData | null>;
}
