const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieHeader = document.cookie;

  const headers = {
    ...options.headers,
    cookie: cookieHeader,
    'Content-Type':
      options.body && !(options.headers && 'Content-Type' in options.headers) ? 'application/json' : undefined,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

  const data = await res.json();
  return data as T;
}
