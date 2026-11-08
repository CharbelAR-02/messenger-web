import { queryOptions } from '@tanstack/react-query'
import { fetchMe } from './api'

export const authKeys = { me: ['me'] as const }

export const meQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    staleTime: 'static', // login, logout and the 401 handler update this explicitly
    retry: false,
    gcTime: Infinity,
  })
