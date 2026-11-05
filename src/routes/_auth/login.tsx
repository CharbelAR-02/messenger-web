import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  component: () => <p>Login (Phase 1)</p>,
})
