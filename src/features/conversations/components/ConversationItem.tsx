import { Link } from '@tanstack/react-router'
import { UserAvatar } from '@/components/user-avatar'
import type { Conversation } from '@/shared/api/types'
import { formatListTimestamp } from '@/shared/lib/time'
import { getConversationAvatarUrl, getConversationTitle, getMessagePreview } from '../display'

interface ConversationItemProps {
  conversation: Conversation
  meId: string
}

export function ConversationItem({ conversation, meId }: ConversationItemProps) {
  const title = getConversationTitle(conversation, meId)
  const last = conversation.messages?.[0]
  const unread = conversation.unread_count ?? 0

  return (
    <Link
      to="/c/$conversationId"
      params={{ conversationId: conversation.id }}
      className="hover:bg-accent/60 flex items-center gap-3 rounded-lg p-3"
      activeProps={{ className: 'bg-accent' }}
    >
      <UserAvatar
        name={title}
        url={getConversationAvatarUrl(conversation, meId)}
        className="size-11"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium">{title}</span>
          {last && (
            <time dateTime={last.created_at} className="text-muted-foreground shrink-0 text-xs">
              {formatListTimestamp(last.created_at)}
            </time>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground truncate text-sm">
            {last ? getMessagePreview(conversation, last, meId) : 'No messages yet'}
          </p>
          {unread > 0 && (
            <span
              className="bg-primary text-primary-foreground min-w-5 shrink-0 rounded-full px-1.5 text-center text-xs font-medium"
              aria-label={`${unread} unread messages`}
            >
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
