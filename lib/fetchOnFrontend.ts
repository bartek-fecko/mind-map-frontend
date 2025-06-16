const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
  if (Array.isArray(headers)) {
    const obj: Record<string, string> = {};
    headers.forEach(([key, value]) => {
      obj[key] = value;
    });
    return obj;
  }
  return headers;
}

export async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieHeader = document.cookie;

  const headers = normalizeHeaders(options.headers);

  if (options.body && !('Content-Type' in headers)) {
    headers['Content-Type'] = 'application/json';
  }

  headers['cookie'] = cookieHeader;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

  const data = await res.json();
  return data as T;
}
