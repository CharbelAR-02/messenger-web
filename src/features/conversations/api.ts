import { api } from '@/shared/api/client'
import type { Conversation } from '@/shared/api/types'

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>('/api/conversations')
  return data
}

export async function getConversation(id: string): Promise<Conversation> {
  const { data } = await api.get<Conversation>(`/api/conversations/${id}`)
  return data
}
