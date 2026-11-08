import { MutationCache, QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api/errors'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      if (!isAxiosError(error)) return
      const status = error.response?.status
      // 401 and 419 are handled by the interceptors, 422 by the forms.
      if (status === 401 || status === 419 || status === 422) return
      toast.error(
        status === 429
          ? 'Too many requests. Please wait a moment and try again.'
          : getErrorMessage(error),
      )
    },
  }),
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})
