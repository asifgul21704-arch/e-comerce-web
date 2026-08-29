// Centralized API and Auth Fetch client for NovaStore

const TOKEN_KEY = 'novastore_auth_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.warn('Failed to save auth token to localStorage', e);
  }
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn('Failed to remove auth token from localStorage', e);
  }
}

/**
 * Universal fetch wrapper that:
 * 1. Attaches Bearer JWT token from localStorage (immune to iframe cookie restrictions)
 * 2. Includes cookies (credentials: 'include')
 * 3. Sets default JSON headers when appropriate
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Set Content-Type only if not already set and body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  };

  return fetch(url, fetchOptions);
}
