import { getAccessToken } from './authService'

function baseUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return ''
  return raw.replace(/\/$/, '')
}

function buildUrl(path: string): string {
  const base = baseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

type JsonBody = unknown

async function request<T>(
  method: string,
  path: string,
  body?: JsonBody,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let init: RequestInit = { method, headers }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    init = { ...init, body: JSON.stringify(body) }
  }

  const res = await fetch(buildUrl(path), init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `${res.status} ${res.statusText}`)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const apiGet = <T>(path: string) => request<T>('GET', path)
export const apiPost = <T>(path: string, body: JsonBody) => request<T>('POST', path, body)
export const apiPut = <T>(path: string, body: JsonBody) => request<T>('PUT', path, body)
export const apiDelete = (path: string) => request<void>('DELETE', path)
