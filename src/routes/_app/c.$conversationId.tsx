import { createFileRoute } from '@tanstack/react-router'
import { ConversationHeader } from '@/features/conversations/components/ConversationHeader'

export const Route = createFileRoute('/_app/c/$conversationId')({ component: ConversationPage })

function ConversationPage() {
  const { conversationId } = Route.useParams()

  return (
    <div className="flex h-full flex-col">
      <ConversationHeader conversationId={conversationId} />
      <div className="text-muted-foreground flex-1 p-6 text-sm">Messages arrive in Part B.</div>
    </div>
  )
}
