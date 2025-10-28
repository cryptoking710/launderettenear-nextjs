import { auth } from "./firebase";

export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: any
): Promise<T> {
  const user = auth.currentUser;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authentication token for protected routes
  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
