import Cookies from "js-cookie";
import { TokenStoragePort, AdminStoredData } from "../../application/ports/token-storage.port";
import { TokenPair } from "../../domain/value-objects/token-pair";

const ACCESS_KEY = "ab_access_token";
const REFRESH_KEY = "ab_refresh_token";
const ADMIN_KEY = "ab_admin";
const DEVICE_ID_KEY = "ab_device_id";

function generateDeviceId(): string {
  return crypto.randomUUID();
}

export class CookieTokenStorage implements TokenStoragePort {
  async save(tokens: TokenPair): Promise<void> {
    Cookies.set(ACCESS_KEY, tokens.accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set(REFRESH_KEY, tokens.refreshToken, {
      secure: true,
      sameSite: "strict",
    });
  }

  async getAccessToken(): Promise<string | null> {
    return Cookies.get(ACCESS_KEY) ?? null;
  }

  async getRefreshToken(): Promise<string | null> {
    return Cookies.get(REFRESH_KEY) ?? null;
  }

  async clear(): Promise<void> {
    Cookies.remove(ACCESS_KEY);
    Cookies.remove(REFRESH_KEY);
    Cookies.remove(ADMIN_KEY);
  }

  async saveAdmin(admin: AdminStoredData): Promise<void> {
    Cookies.set(ADMIN_KEY, JSON.stringify(admin), {
      secure: true,
      sameSite: "strict",
    });
  }

  async getAdmin(): Promise<AdminStoredData | null> {
    const raw = Cookies.get(ADMIN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminStoredData;
    } catch {
      return null;
    }
  }

  getDeviceId(): string {
    let deviceId = Cookies.get(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = generateDeviceId();
      Cookies.set(DEVICE_ID_KEY, deviceId, {
        secure: true,
        sameSite: "strict",
        expires: 365,
      });
    }
    return deviceId;
  }
}
