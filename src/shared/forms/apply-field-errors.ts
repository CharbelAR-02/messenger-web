import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { getFieldErrors } from '@/shared/api/errors'

// Puts Laravel's 422 messages on the matching form fields.
// Any other kind of error is reported by the global handler in query-client.ts.
export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
) {
  const errors = getFieldErrors(error)
  if (!errors) return

  let matched = false
  for (const field of fields) {
    const message = errors[field]?.[0]
    if (message) {
      setError(field, { type: 'server', message })
      matched = true
    }
  }
  if (!matched) toast.error(Object.values(errors)[0]?.[0] ?? 'Please check your input.')
}
