'use client';

/**
 * Returns a path builder for affiliate routes.
 * On the `afiliados.*` domain the middleware handles the /affiliate rewrite,
 * so navigation should use bare paths (/login, /dashboard).
 * On any other domain (admin, localhost) the full /affiliate/* prefix is needed.
 */
export function useAffiliatePath() {
  const isAffiliateDomain =
    typeof window !== 'undefined' &&
    window.location.hostname.startsWith('afiliados.');

  return (path: string) =>
    isAffiliateDomain ? path : `/affiliate${path}`;
}
