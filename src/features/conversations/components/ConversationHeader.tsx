import { isAxiosError } from 'axios'
import { UserAvatar } from '@/components/user-avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMe } from '@/features/auth/hooks'
import { getActiveMemberCount, getConversationAvatarUrl, getConversationTitle } from '../display'
import { useConversation } from '../queries'

export function ConversationHeader({ conversationId }: { conversationId: string }) {
  const me = useMe()
  const { data: conversation, isPending, isError, error, refetch } = useConversation(conversationId)

  if (!me) return null

  if (isPending) {
    return (
      <header className="flex items-center gap-3 border-b p-4" aria-hidden>
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </header>
    )
  }

  if (isError && !conversation) {
    const notFound = isAxiosError(error) && error.response?.status === 404
    return (
      <header className="flex items-center justify-between gap-3 border-b p-4">
        <p className="text-muted-foreground text-sm">
          {notFound
            ? 'This conversation doesn’t exist, or you no longer have access to it.'
            : 'Couldn’t load this conversation.'}
        </p>
        {!notFound && (
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Try again
          </Button>
        )}
      </header>
    )
  }

  const title = getConversationTitle(conversation, me.id)

  return (
    <header className="flex items-center gap-3 border-b p-4">
      <UserAvatar
        name={title}
        url={getConversationAvatarUrl(conversation, me.id)}
        className="size-10"
      />
      <div className="min-w-0">
        <h1 className="truncate font-semibold">{title}</h1>
        {conversation.type === 'group' && (
          <p className="text-muted-foreground text-xs">
            {getActiveMemberCount(conversation)} members
          </p>
        )}
      </div>
    </header>
  )
}
