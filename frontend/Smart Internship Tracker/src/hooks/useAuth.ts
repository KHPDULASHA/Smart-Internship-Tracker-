import { getAccessToken, getStoredEmail, getStoredUserId } from '../services/authService'

/** Snapshot of auth from localStorage (does not subscribe to changes across tabs). */
export function useAuth() {
  return {
    isAuthenticated: Boolean(getAccessToken()),
    userId: getStoredUserId(),
    email: getStoredEmail(),
  }
}
