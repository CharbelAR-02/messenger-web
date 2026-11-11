import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { meQueryOptions } from '@/features/auth/queries'
import { UserMenu } from '@/features/auth/components/UserMenu'
import { ConversationList } from '@/features/conversations/components/ConversationList'

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context, location }) => {
    const me = await context.queryClient.query(meQueryOptions())
    if (!me) throw redirect({ to: '/login', search: { redirect: location.href } })
    return { me }
  },
  component: () => (
    <div className="flex h-dvh">
      <aside className="flex w-80 shrink-0 flex-col border-r">
        <header className="flex items-center justify-between border-b p-4">
          <span className="font-semibold">Messenger</span>
          <UserMenu />
        </header>
        <div className="flex-1 overflow-y-auto">
          <ConversationList />
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  ),
})
