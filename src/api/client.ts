import axios from "axios"
import { useAuthStore } from "@/store/authStore"

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export const api = axios.create({
  baseURL,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let refreshPromise: Promise<string> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!refreshPromise) {
      refreshPromise = axios
        .post(
          `${baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true
          }
        )
        .then((response) => {
          const token = response.data.accessToken as string
          useAuthStore.getState().setAccessToken(token)
          return token
        })
        .catch((refreshError) => {
          useAuthStore.getState().clearSession()

          if (typeof window !== "undefined") {
          window.location.href = "/login"
        }

        throw refreshError
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    const nextToken = await refreshPromise
    originalRequest.headers.Authorization = `Bearer ${nextToken}`
    return api(originalRequest)
  }
)
