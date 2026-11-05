import { configureEcho, echo } from '@laravel/echo-react'
import Pusher, { type ChannelAuthorizationCallback } from 'pusher-js'
import { api } from '@/shared/api/client'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

export function setupEcho() {
  configureEcho({
    broadcaster: 'reverb',
    authorizer: (channel: { name: string }) => ({
      authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
        api.post('/broadcasting/auth', { socket_id: socketId, channel_name: channel.name }).then(
          (response) => callback(null, response.data),
          (error: Error) => callback(error, null),
        )
      },
    }),
  })

  api.interceptors.request.use((config) => {
    const socketId = echo().socketId()
    if (socketId) config.headers['X-Socket-ID'] = socketId
    return config
  })
}
