import axios, { isAxiosError } from 'axios'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _csrfRetried?: boolean
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie')

let onUnauthorized: (() => void) | undefined

// The app registers this at startup, so the API layer never imports the router.
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (isAxiosError(error) && error.config) {
    const status = error.response?.status

    // CSRF token expired: fetch a fresh one and retry the request once.
    if (status === 419 && !error.config._csrfRetried) {
      error.config._csrfRetried = true
      await getCsrfCookie()
      return api(error.config)
    }

    // Session ended. /api/user is exempt, because a 401 there just means "not logged in".
    if (status === 401 && !error.config.url?.endsWith('/api/user')) {
      onUnauthorized?.()
    }
  }
  return Promise.reject(error)
})
