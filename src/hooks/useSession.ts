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

export const useSession = () => {
  const queryClient = useQueryClient()
  const { user, setUser } = useAuthStore()

  const meQuery = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me")
      return response.data.user
    },
    initialData: user,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data)
    }
  }, [meQuery.data, setUser])

  useEffect(() => {
    const status = (meQuery.error as AxiosError | null)?.response?.status

    if (status === 401) {
      setUser(null)
    }
  }, [meQuery.error, setUser])

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginInput) => {
      const response = await api.post("/auth/login", payload)
      return response.data
    },

    onSuccess: (data) => {
      setUser(data.user)
      queryClient.setQueryData(["me"], data.user)
    }
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const response = await api.post("/auth/register", payload)
      return response.data
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
    isLoggingOut: logoutMutation.isPending
  }
}
