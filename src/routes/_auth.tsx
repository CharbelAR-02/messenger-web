import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { meQueryOptions } from '@/features/auth/queries'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.query(meQueryOptions())
    if (me) throw redirect({ to: '/' })
  },
  component: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  ),
})
