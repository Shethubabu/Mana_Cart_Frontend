import { create } from "zustand"
import type { User } from "@/lib/types"
import { api } from "@/api/client"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user
    })
  },

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/me")

      set({
        user: res.data.user,
        isAuthenticated: true
      })
    } catch {
      set({
        user: null,
        isAuthenticated: false
      })
    }
  },

  logout: async () => {
    await api.post("/auth/logout")

    set({
      user: null,
      isAuthenticated: false
    })
  }
}))