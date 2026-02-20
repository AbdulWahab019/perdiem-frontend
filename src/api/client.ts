/**
 * Base API client.
 * Handles authentication, base URL, and error handling for all API calls.
 */

/** Custom API error class */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_KEY = import.meta.env.VITE_API_KEY ?? "";

/**
 * Makes an authenticated fetch request to the backend API.
 * Handles error responses by throwing ApiError with structured info.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorBody: { error?: string; message?: string } = {};
    try {
      errorBody = await response.json();
    } catch {
      // Response wasn't JSON
    }
    throw new ApiError(
      response.status,
      errorBody.error ?? "Error",
      errorBody.message ?? `Request failed with status ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}
