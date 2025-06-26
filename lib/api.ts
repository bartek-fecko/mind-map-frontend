import { getSession, signOut } from 'next-auth/react';

let cachedToken: { accessToken: string; expiresIn: number } | null = null;

const BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchWithToken(path: string, options: RequestInit = {}): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('fetchWithToken cannot be used in Server Components.');
  }

  if (cachedToken && Date.now() < cachedToken.expiresIn) {
    return fetchWithAuth(path, options, cachedToken.accessToken);
  }

  const session = await getSession();
  const accessToken = session?.backendTokens?.accessToken;
  const expiresIn = session?.backendTokens?.expiresIn || 0;

  if (!session) return new Promise(() => ({ json: () => {} }));

  if (!accessToken || Date.now() >= expiresIn) {
    await signOut({ callbackUrl: '/login' });
    throw new Error('Session expired — logging out');
  }

  cachedToken = { accessToken, expiresIn };

  return fetchWithAuth(path, options, accessToken);
}

function fetchWithAuth(path: string, options: RequestInit, token: string) {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Authorization: `Bearer ${token}`,
  };

  const fullUrl = `${BASE_URL}${path}`;

  return fetch(fullUrl, {
    ...options,
    headers,
  });
}
