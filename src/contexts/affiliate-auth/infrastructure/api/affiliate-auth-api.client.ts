import { env } from '@/shared/config/env';
import { AffiliateInvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

export interface AffiliateAuthApiResponse {
  accessToken: string;
  affiliate: {
    id: string;
    name: string;
    email: string;
  };
}

export const affiliateAuthApiClient = {
  async checkCpf(cpf: string): Promise<{ hasPassword: boolean }> {
    const res = await fetch(`${env.API_BASE_URL}/affiliate/auth/check?cpf=${encodeURIComponent(cpf)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 404) {
      throw new AffiliateInvalidCredentialsError();
    }

    if (!res.ok) {
      throw new AffiliateInvalidCredentialsError();
    }

    return res.json();
  },

  async login(cpf: string, password: string): Promise<AffiliateAuthApiResponse> {
    const res = await fetch(`${env.API_BASE_URL}/affiliate/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, password }),
    });

    if (!res.ok) {
      throw new AffiliateInvalidCredentialsError();
    }

    return res.json();
  },

  async setupPassword(cpf: string, password: string): Promise<AffiliateAuthApiResponse> {
    const res = await fetch(`${env.API_BASE_URL}/affiliate/auth/setup-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? 'Erro ao configurar senha');
    }

    return res.json();
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${env.API_BASE_URL}/affiliate/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? 'Erro ao solicitar recuperação de senha');
    }

    return res.json();
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const res = await fetch(`${env.API_BASE_URL}/affiliate/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? 'Erro ao redefinir senha');
    }

    return res.json();
  },

  async verifyResetToken(token: string): Promise<{ valid: boolean; email: string }> {
    const res = await fetch(`${env.API_BASE_URL}/affiliate/auth/verify-reset-token?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? 'Token inválido ou expirado');
    }

    return res.json();
  },
};
