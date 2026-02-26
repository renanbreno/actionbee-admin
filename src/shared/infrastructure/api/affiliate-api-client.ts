import { env } from '@/shared/config/env';
import Cookies from 'js-cookie';
import { AffiliateSessionExpiredError } from '@/contexts/affiliate-auth/domain/errors/session-expired.error';

export async function affiliateApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = Cookies.get('ab_aff_access_token');

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    Cookies.remove('ab_aff_access_token');
    Cookies.remove('ab_aff_user');
    if (typeof window !== 'undefined') {
      window.location.href = '/affiliate/login';
    }
    throw new AffiliateSessionExpiredError();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
