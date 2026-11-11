import type { Conversation, Message, User } from '@/shared/api/types'

export function getOtherParticipant(conversation: Conversation, meId: string): User | undefined {
  return conversation.participants?.find((p) => p.user_id !== meId)?.user
}

export function getConversationTitle(conversation: Conversation, meId: string): string {
  if (conversation.type === 'group') return conversation.name ?? 'Group'
  return getOtherParticipant(conversation, meId)?.name ?? 'Unknown user'
}

export function getConversationAvatarUrl(conversation: Conversation, meId: string): string | null {
  if (conversation.type === 'group') return conversation.avatar_url
  return getOtherParticipant(conversation, meId)?.avatar_url ?? null
}

function describeMessage(message: Message): string {
  switch (message.type) {
    case 'text':
      return message.body ?? ''
    case 'image':
      return message.body ? `Photo: ${message.body}` : 'Photo'
    case 'file':
      return message.body ? `File: ${message.body}` : 'File'
    case 'voice':
      return 'Voice message'
  }
}

// "You: …" for your own messages, "Alice: …" for others' messages in groups.
export function getMessagePreview(
  conversation: Conversation,
  message: Message,
  meId: string,
): string {
  const content = describeMessage(message)
  if (message.user_id === meId) return `You: ${content}`
  if (conversation.type === 'group') {
    const sender = conversation.participants?.find((p) => p.user_id === message.user_id)
    const firstName = sender?.user.name.split(' ')[0]
    if (firstName) return `${firstName}: ${content}`
  }
  return content
}

export function getActiveMemberCount(conversation: Conversation): number {
  return conversation.participants?.filter((p) => p.left_at === null).length ?? 0
}
