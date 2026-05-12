const TOKEN_KEY = 'it_auth_token'
const USER_ID_KEY = 'it_auth_user_id'
const EMAIL_KEY = 'it_auth_email'

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY)
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY)
}

export function setSession(token: string, userId: string, email: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_ID_KEY, userId)
  localStorage.setItem(EMAIL_KEY, email)
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(EMAIL_KEY)
}
