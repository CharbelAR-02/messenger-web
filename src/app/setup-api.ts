import { clearSession } from '@/features/auth/session'
import { setUnauthorizedHandler } from '@/shared/api/client'
import { queryClient } from './query-client'
import { router } from './router'

export function setupApi() {
  setUnauthorizedHandler(() => {
    if (router.state.location.pathname.startsWith('/login')) return

    clearSession(queryClient)
    void router.navigate({ to: '/login', search: { redirect: router.state.location.href } })
  })
}
