import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useEffect } from "react"
import { api } from "@/api/client"
import { useAuthStore } from "@/store/authStore"
import type { User } from "@/lib/types"

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

interface ProfileInput {
  name: string
  email: string
  phone: string
}

const profileStorageKey = (userId: number) => `manacart-profile:${userId}`

const readStoredProfile = (userId: number) => {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const value = window.localStorage.getItem(profileStorageKey(userId))
    return value ? (JSON.parse(value) as Partial<User>) : null
  } catch {
    return null
  }
}

const writeStoredProfile = (user: ProfileInput & { id: number }) => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    profileStorageKey(user.id),
    JSON.stringify({
      name: user.name,
      email: user.email,
      phone: user.phone
    })
  )
}

const mergeStoredProfile = (user: User | null) => {
  if (!user) {
    return null
  }

  return {
    ...user,
    ...readStoredProfile(user.id)
  }
}

export const useSession = () => {
  const queryClient = useQueryClient()
  const { user, setUser } = useAuthStore()

  const fetchSessionUser = async () => {
    try {
      const response = await api.get("/auth/me")
      return mergeStoredProfile(response.data.user as User)
    } catch (error) {
      const status = (error as AxiosError | null)?.response?.status

      if (status === 401) {
        return null
      }

      throw error
    }
  }

  const meQuery = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: fetchSessionUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  useEffect(() => {
    if (meQuery.isSuccess) {
      setUser(meQuery.data ?? null)
    }
  }, [meQuery.data, meQuery.isSuccess, setUser])

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginInput) => {
      await api.post("/auth/login", payload)
      const sessionUser = await fetchSessionUser()
      return { user: sessionUser }
    },

    onSuccess: (data) => {
      setUser(data.user)
      queryClient.setQueryData(["me"], data.user)
    }
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterInput) => {
      await api.post("/auth/register", payload)
      const sessionUser = await fetchSessionUser()
      return { user: sessionUser }
    },

    onSuccess: (data) => {
      setUser(data.user)
      queryClient.setQueryData(["me"], data.user)
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout")
    },

    onSuccess: () => {
      setUser(null)

      queryClient.removeQueries({ queryKey: ["me"] })
      queryClient.removeQueries({ queryKey: ["addresses"] })
      queryClient.removeQueries({ queryKey: ["cart"] })
      queryClient.removeQueries({ queryKey: ["orders"] })
    }
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: ProfileInput) => {
      const currentUser = (queryClient.getQueryData(["me"]) as User | null) || user

      if (!currentUser) {
        throw new Error("No active session")
      }

      let nextUser: User = {
        ...currentUser,
        ...payload
      }

      try {
        const response = await api.patch("/auth/me", payload)
        nextUser = mergeStoredProfile({
          ...(response.data.user as User),
          phone: payload.phone
        }) as User
      } catch (error) {
        const status = (error as AxiosError | null)?.response?.status

        if (status && ![404, 405].includes(status)) {
          throw error
        }
      }

      writeStoredProfile({
        id: currentUser.id,
        ...payload
      })

      return mergeStoredProfile(nextUser) as User
    },

    onSuccess: (nextUser) => {
      setUser(nextUser)
      queryClient.setQueryData(["me"], nextUser)
    }
  })

  return {
    user: meQuery.data || user,
    isAuthenticated: Boolean(meQuery.data || user),
    isLoadingUser: meQuery.isLoading,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending
  }
}
