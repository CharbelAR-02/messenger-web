import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { meQueryOptions } from '@/features/auth/queries'
import { UserMenu } from '@/features/auth/components/UserMenu'

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context, location }) => {
    const me = await context.queryClient.query(meQueryOptions())
    if (!me) throw redirect({ to: '/login', search: { redirect: location.href } })
    return { me }
  },
  component: () => (
    <div className="flex min-h-screen">
      <aside className="flex w-80 flex-col border-r">
        <header className="flex items-center justify-between border-b p-4">
          <span className="font-semibold">Messenger</span>
          <UserMenu />
        </header>
        <div className="text-muted-foreground flex-1 p-4 text-sm">Conversations (Phase 2)</div>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  ),
})
