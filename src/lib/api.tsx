export const API_BASE =
  import.meta.env.VITE_API_BASE || "https://api.zooda.in";

const DEFAULT_TIMEOUT = 30000;

function timeoutFetch(url: string, options: RequestInit, timeout = DEFAULT_TIMEOUT) {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);
}

export async function apiJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await timeoutFetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await (res as Response).json().catch(() => ({}));

  if (!(res as Response).ok) {
    throw new Error((data as any)?.message || "Request failed");
  }

  return data as T;
}

export async function apiForm<T>(url: string, form: FormData): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await timeoutFetch(`${API_BASE}${url}`, {
    method: "POST",
    body: form,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await (res as Response).json().catch(() => ({}));

  if (!(res as Response).ok) {
    throw new Error((data as any)?.message || "Request failed");
  }

  return data as T;
}