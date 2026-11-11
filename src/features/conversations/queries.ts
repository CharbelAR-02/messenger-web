import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Conversation } from '@/shared/api/types'
import { getConversation, getConversations } from './api'

export const conversationKeys = {
  all: ['conversations'] as const,
  list: () => [...conversationKeys.all, 'list'] as const,
  detail: (id: string) => [...conversationKeys.all, 'detail', id] as const,
}

export const conversationsQueryOptions = () =>
  queryOptions({ queryKey: conversationKeys.list(), queryFn: getConversations })

export const conversationQueryOptions = (id: string) =>
  queryOptions({ queryKey: conversationKeys.detail(id), queryFn: () => getConversation(id) })

export function useConversations() {
  return useQuery(conversationsQueryOptions())
}

// The list already contains everything the header needs, so it seeds the detail query.
// Opening a conversation shows its header instantly, then refreshes in the background.
export function useConversation(id: string) {
  const queryClient = useQueryClient()
  return useQuery({
    ...conversationQueryOptions(id),
    initialData: () =>
      queryClient.getQueryData<Conversation[]>(conversationKeys.list())?.find((c) => c.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(conversationKeys.list())?.dataUpdatedAt,
  })
}
