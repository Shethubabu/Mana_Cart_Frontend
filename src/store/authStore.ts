import { create } from "zustand"
import type { User } from "@/lib/types"

const ACCESS_TOKEN_KEY = "manacart_access_token"

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return ""
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || ""
}

const storeToken = (token: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

const removeToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

interface AuthState {
  user: User | null
  accessToken: string
  setSession: (payload: { user: User; accessToken: string }) => void
  setAccessToken: (accessToken: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: getStoredToken(),
  setSession: ({ user, accessToken }) => {
    storeToken(accessToken)
    set({ user, accessToken })
  },
  setAccessToken: (accessToken) => {
    storeToken(accessToken)
    set({ accessToken })
  },
  clearSession: () => {
    removeToken()
    set({ user: null, accessToken: "" })
  }
}))
