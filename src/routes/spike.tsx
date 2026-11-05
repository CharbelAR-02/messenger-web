import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useConnectionStatus, useEcho } from '@laravel/echo-react'
import { Button } from '@/components/ui/button'
import { api, getCsrfCookie } from '@/shared/api/client'
import type { Me } from '@/shared/api/types'

export const Route = createFileRoute('/spike')({ component: Spike })

function Listener({ userId, onEvent }: { userId: string; onEvent: (line: string) => void }) {
  useEcho<unknown>(
    `user.${userId}`,
    [
      'MessageSent',
      'MessageUpdated',
      'MessageDeleted',
      'ReactionToggled',
      'MessagesRead',
      'UserTyping',
      'PresenceChanged',
    ],
    (payload) => onEvent(JSON.stringify(payload)),
  )
  return null
}

function Spike() {
  const status = useConnectionStatus()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [conversationId, setConversationId] = useState('')
  const [me, setMe] = useState<Me | null>(null)
  const [lines, setLines] = useState<string[]>([])

  const log = (line: string) => setLines((l) => [line, ...l])

  async function login() {
    await getCsrfCookie()
    const { data } = await api.post<Me>('/api/login', { email, password })
    setMe(data)
  }

  async function loadSession() {
    const { data } = await api.get<Me>('/api/user')
    setMe(data)
    log(`GET /api/user -> ${data.name}`)
  }

  async function post() {
    await api.post(`/api/conversations/${conversationId}/messages`, {
      type: 'text',
      body: 'spike message',
    })
    log('POST message sent')
  }

  return (
    <div className="space-y-3 p-6">
      <p>Connection: {status}</p>
      <div className="flex gap-2">
        <input
          className="border px-2 py-1"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border px-2 py-1"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={login}>Log in</Button>
        <Button variant="outline" onClick={loadSession}>
          Load session
        </Button>
      </div>
      <div className="flex gap-2">
        <input
          className="w-96 border px-2 py-1"
          placeholder="conversation id"
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
        />
        <Button onClick={post}>Post message</Button>
      </div>
      <p>User: {me ? me.name : 'not logged in'}</p>
      {me && <Listener userId={me.id} onEvent={log} />}
      <pre className="text-sm whitespace-pre-wrap">{lines.join('\n')}</pre>
    </div>
  )
}
