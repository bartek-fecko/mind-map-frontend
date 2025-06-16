'use server';

import { cookies } from 'next/headers';

export async function fetchOnBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const headersObj: Record<string, string> = {};

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headersObj[key] = value;
      });
    } else {
      Object.assign(headersObj, options.headers);
    }
  }

  headersObj['cookie'] = cookieHeader;

  if (options.body && !headersObj['Content-Type']) {
    headersObj['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: headersObj,
  };

  const res = await fetch(`${process.env.API_URL}${endpoint}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  const data = await res.json();
  return data as T;
}
