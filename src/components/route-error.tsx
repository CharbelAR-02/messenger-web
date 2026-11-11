import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { isNetworkError } from '@/shared/api/errors'

export function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter()
  const unreachable = isNetworkError(error)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-lg font-semibold">
        {unreachable ? 'Can’t reach the server' : 'Something went wrong'}
      </h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        {unreachable
          ? 'Check your connection and try again.'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <Button
        onClick={() => {
          reset()
          // Re-run the guards. The failed `me` query has no data, so it fetches again.
          void router.invalidate()
        }}
      >
        Try again
      </Button>
    </div>
  )
}
