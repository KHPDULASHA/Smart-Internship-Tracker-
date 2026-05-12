import axios from 'axios'
import { getAccessToken } from './authService'

function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return ''
  return raw.replace(/\/$/, '')
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getAxiosErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object') {
      const msg = (data as { message?: unknown; title?: unknown }).message
      if (typeof msg === 'string') return msg
      const title = (data as { title?: unknown }).title
      if (typeof title === 'string') return title
    }
    if (error.response?.statusText) {
      return `${error.response.status} ${error.response.statusText}`
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Request failed'
}
