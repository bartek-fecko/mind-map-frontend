import { fetchOnBackend } from './fetchOnBackend';
import { fetchClient } from './fetchOnFrontend';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (typeof window === 'undefined') {
    return fetchOnBackend<T>(endpoint, options);
  } else {
    return fetchClient<T>(endpoint, options);
  }
}
