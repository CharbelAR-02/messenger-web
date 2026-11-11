import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMe } from '@/features/auth/hooks'
import { useConversations } from '../queries'
import { ConversationItem } from './ConversationItem'

function ListSkeleton() {
  return (
    <div className="grid gap-1 p-2" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="size-11 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ConversationList() {
  const me = useMe()
  const { data, isPending, refetch } = useConversations()

  if (!me) return null

  if (!data) {
    if (isPending) return <ListSkeleton />
    return (
      <div className="grid justify-items-center gap-3 p-6 text-center">
        <p className="text-muted-foreground text-sm">Couldn’t load your conversations.</p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground p-6 text-center text-sm">No conversations yet.</p>
  }

  return (
    <nav aria-label="Conversations" className="grid grid-cols-1 gap-1 p-2">
      {data.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} meId={me.id} />
      ))}
    </nav>
  )
}
