import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'
export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const target = search.redirect
    const internal =
      typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')
    return { redirect: internal ? target : undefined }
  },
  component: LoginForm,
})
