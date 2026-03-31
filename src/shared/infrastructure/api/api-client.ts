import { env } from "@/shared/config/env";
import Cookies from "js-cookie";
import { refreshSessionUseCase } from "@/contexts/auth/di";
import { SessionExpiredError } from "@/contexts/auth/domain/errors/session-expired.error";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let accessToken = Cookies.get("ab_access_token");

  // Don't set Content-Type for FormData — the browser sets it automatically with the boundary
  const isFormData = options.body instanceof FormData;

  const executeRequest = async (token?: string) => {
    return await fetch(`${env.API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  let res = await executeRequest(accessToken);

  // Handle 401 - try to refresh token
  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          await refreshSessionUseCase.execute();
        } catch {
          isRefreshing = false;
          refreshPromise = null;
          // Clear tokens and redirect to login
          Cookies.remove("ab_access_token");
          Cookies.remove("ab_refresh_token");
          Cookies.remove("ab_admin");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw new SessionExpiredError();
        }
        isRefreshing = false;
        refreshPromise = null;
      })();
    }

    try {
      await refreshPromise;
    } catch {
      throw new SessionExpiredError();
    }

    // Get new token and retry original request
    accessToken = Cookies.get("ab_access_token");
    res = await executeRequest(accessToken);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiFetchBlob(
  path: string,
  options: RequestInit = {},
): Promise<Blob> {
  let accessToken = Cookies.get("ab_access_token");

  const executeRequest = async (token?: string) => {
    return await fetch(`${env.API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  let res = await executeRequest(accessToken);

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          await refreshSessionUseCase.execute();
        } catch {
          isRefreshing = false;
          refreshPromise = null;
          Cookies.remove("ab_access_token");
          Cookies.remove("ab_refresh_token");
          Cookies.remove("ab_admin");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw new SessionExpiredError();
        }
        isRefreshing = false;
        refreshPromise = null;
      })();
    }

    try {
      await refreshPromise;
    } catch {
      throw new SessionExpiredError();
    }

    accessToken = Cookies.get("ab_access_token");
    res = await executeRequest(accessToken);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  return res.blob();
}
