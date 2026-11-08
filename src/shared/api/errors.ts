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

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isAxiosError<LaravelErrorBody>(error)) {
    if (!error.response) return 'Cannot reach the server. Check your connection.'
    return error.response.data?.message ?? fallback
  }
  return fallback
}
