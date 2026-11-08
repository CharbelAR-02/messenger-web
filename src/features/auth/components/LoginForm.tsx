import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { applyFieldErrors } from '@/shared/forms/apply-field-errors'
import { login } from '../api'
import { authKeys } from '../queries'

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})
type Values = z.infer<typeof schema>

export function LoginForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const router = useRouter()
  const { redirect } = useSearch({ from: '/_auth/login' })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (me) => {
      queryClient.setQueryData(authKeys.me, me)
      // `redirect` was validated as an internal path by the route.
      if (redirect) router.history.push(redirect)
      else void navigate({ to: '/' })
    },
    onError: (error) => applyFieldErrors(error, setError, ['email', 'password']),
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Welcome back to Messenger.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="grid gap-4"
          noValidate
        >
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <FormField
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          No account?{' '}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
