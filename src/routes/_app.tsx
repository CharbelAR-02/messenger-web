import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: () => (
    <div className="flex min-h-screen">
      <aside className="w-80 border-r p-4">Conversations</aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  ),
})
