import { useQuery } from '@tanstack/react-query'
import { meQueryOptions } from './queries'

export function useMe() {
  return useQuery(meQueryOptions()).data ?? null
}
