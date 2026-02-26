import { env } from '@/shared/config/env';
import { AffiliateInvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { AffiliateNoPasswordError } from '../../domain/errors/no-password.error';

export interface AffiliateAuthApiResponse {
  accessToken: string;
  affiliate: {
    id: string;
    name: string;
    email: string;
  };
}

export const affiliateAuthApiClient = {
  async login(cpf: string, password: string): Promise<AffiliateAuthApiResponse> {
    const res = await fetch(`${env.API_BASE_URL}/affiliate/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, password }),
    });

    if (res.status === 401) {
      const body = await res.json().catch(() => ({}));
      if (body?.message === 'Senha não cadastrada') {
        throw new AffiliateNoPasswordError();
      }
      throw new AffiliateInvalidCredentialsError();
    }

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
};
