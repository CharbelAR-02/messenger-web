export type Uuid = string
export type IsoDate = string

// UserResource: the public shape, never includes an email
export interface User {
  id: Uuid
  name: string
  avatar_url: string | null
  is_online: boolean
  last_seen_at: IsoDate | null
}

// MeResource: returned only by /user, /login, /register, PATCH /profile
export interface Me {
  id: Uuid
  name: string
  email: string
  avatar_url: string | null
  created_at: IsoDate
}

export type ParticipantRole = 'admin' | 'member'

export interface Participant {
  user_id: Uuid
  user: User
  role: ParticipantRole
  last_read_message_id: Uuid | null
  joined_at: IsoDate
  left_at: IsoDate | null
  // present only on the requester's own row
  muted_at?: IsoDate | null
  pinned_at?: IsoDate | null
  archived_at?: IsoDate | null
}

// Conversation list only. Timestamps here are raw database strings, not ISO.
export interface Membership {
  role: ParticipantRole
  last_read_message_id: Uuid | null
  muted_at: string | null
  pinned_at: string | null
  archived_at: string | null
}

export interface Attachment {
  id: Uuid
  file_type: string
  file_size: number
  url: string
  thumbnail_url: string | null
}

export interface Reaction {
  id: Uuid
  message_id: Uuid
  user_id: Uuid
  emoji: string
}

export type MessageType = 'text' | 'image' | 'file' | 'voice'
export type MessageSender = Pick<User, 'id' | 'name' | 'avatar_url'>

export interface Message {
  id: Uuid
  conversation_id: Uuid
  user_id: Uuid
  sender?: MessageSender // absent in the conversation-list preview
  type: MessageType
  body: string | null
  reply_to_id: Uuid | null
  reply_to?: Message | null // compact: no sender, attachments or reactions
  edited_at: IsoDate | null
  created_at: IsoDate
  attachments?: Attachment[]
  reactions?: Reaction[]
}

export type ConversationType = 'private' | 'group'

export interface Conversation {
  id: Uuid
  type: ConversationType
  name: string | null
  avatar_url: string | null
  created_by: Uuid | null
  created_at: IsoDate
  unread_count?: number // list only
  membership?: Membership // list only
  participants?: Participant[] // list, show, create, add-participant
  messages?: Message[] // list only: latest message preview (0 or 1 item)
}

export interface CursorPage<T> {
  data: T[]
  links: { first: string | null; last: string | null; prev: string | null; next: string | null }
  meta: { path: string; per_page: number; next_cursor: string | null; prev_cursor: string | null }
}

// Real-time payloads, delivered on the private channel user.{id}
export interface MessageSentEvent {
  message: Message
}
export interface MessageUpdatedEvent {
  message: Message
}
export interface MessageDeletedEvent {
  message_id: Uuid
  conversation_id: Uuid
}
export interface ReactionToggledEvent {
  message_id: Uuid
  conversation_id: Uuid
  user_id: Uuid
  emoji: string
  status: 'added' | 'removed'
}
export interface MessagesReadEvent {
  conversation_id: Uuid
  user_id: Uuid
  last_read_message_id: Uuid
}
export interface UserTypingEvent {
  conversation_id: Uuid
  user_id: Uuid
}
export interface PresenceChangedEvent {
  user_id: Uuid
  is_online: boolean
  last_seen_at: IsoDate | null
}
