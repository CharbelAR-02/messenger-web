import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { applyFieldErrors } from '@/shared/forms/apply-field-errors'
import { register as registerUser } from '../api'
import { authKeys } from '../queries'

const schema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name').max(255),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Use at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })
type Values = z.infer<typeof schema>

export function RegisterForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
  })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (me) => {
      queryClient.setQueryData(authKeys.me, me)
      void navigate({ to: '/' })
    },
    onError: (error) =>
      applyFieldErrors(error, setError, ['name', 'email', 'password', 'password_confirmation']),
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Start chatting in a minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="grid gap-4"
          noValidate
        >
          <FormField
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
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
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <FormField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.password_confirmation?.message}
            {...register('password_confirmation')}
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Already registered?{' '}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
