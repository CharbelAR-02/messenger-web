import type { QueryClient } from '@tanstack/react-query'
import { authKeys } from './queries'

// Forget everything about the current user. The `me` entry stays, set to "logged out".
export function clearSession(queryClient: QueryClient) {
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== authKeys.me[0] })
  queryClient.setQueryData(authKeys.me, null)
}
