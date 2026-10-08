const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type RequestOptions = RequestInit & {
  body?: BodyInit | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'mensagem' in data
      ? String((data as { mensagem: string }).mensagem)
      : 'Não foi possível concluir a ação.';
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  }),
  put: <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' })
};
