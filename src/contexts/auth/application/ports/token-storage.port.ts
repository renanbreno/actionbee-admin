import { TokenPair } from "../../domain/value-objects/token-pair";

export interface AdminStoredData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TokenStoragePort {
  save(tokens: TokenPair): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  clear(): Promise<void>;
  saveAdmin(admin: AdminStoredData): Promise<void>;
  getAdmin(): Promise<AdminStoredData | null>;
  getDeviceId(): string;
}
