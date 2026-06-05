import { env } from "@/shared/config/env";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";

export interface AuthApiLoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export interface AuthApiRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApiClient = {
  async login(email: string, password: string, deviceId: string): Promise<AuthApiLoginResponse> {
    const res = await fetch(`${env.API_BASE_URL}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, deviceId }),
    });

    if (!res.ok) {
      throw new InvalidCredentialsError();
    }

    return res.json();
  },

  async refresh(refreshToken: string, deviceId: string): Promise<AuthApiRefreshResponse> {
    const res = await fetch(`${env.API_BASE_URL}/admin/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, deviceId }),
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    return res.json();
  },
};
