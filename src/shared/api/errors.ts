import { isAxiosError } from 'axios'

export type FieldErrors = Record<string, string[]>

interface LaravelErrorBody {
  message?: string
  errors?: FieldErrors
}

export function getFieldErrors(error: unknown): FieldErrors | null {
  if (isAxiosError<LaravelErrorBody>(error) && error.response?.status === 422) {
    return error.response.data?.errors ?? null
  }
  return null
}

// The request never got a response: server down, no connection, DNS failure, timeout.
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isNetworkError(error)) return 'Cannot reach the server. Check your connection.'
  if (isAxiosError<LaravelErrorBody>(error)) return error.response?.data?.message ?? fallback
  return fallback
}
