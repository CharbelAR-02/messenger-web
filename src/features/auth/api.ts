import { isAxiosError } from 'axios'
import { api, getCsrfCookie } from '@/shared/api/client'
import type { Me } from '@/shared/api/types'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  password_confirmation: string
}

// Resolves to null when nobody is logged in
export async function fetchMe(): Promise<Me | null> {
  try {
    const { data } = await api.get<Me>('/api/user')
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) return null
    throw error
  }
}

export async function login(input: LoginInput): Promise<Me> {
  await getCsrfCookie()
  const { data } = await api.post<Me>('/api/login', input)
  return data
}

export async function register(input: RegisterInput): Promise<Me> {
  await getCsrfCookie()
  const { data } = await api.post<Me>('/api/register', input)
  return data
}

export async function logout(): Promise<void> {
  await api.post('/api/logout')
}
