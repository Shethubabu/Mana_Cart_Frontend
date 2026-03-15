import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "@/store/authStore"

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export const api = axios.create({
  baseURL,
  withCredentials: true
})

let refreshPromise: Promise<void> | null = null

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      InternalAxiosRequestConfig & { _retry?: boolean }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!refreshPromise) {
      refreshPromise = axios
        .post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        .then(() => {})
        .catch((refreshError) => {
          useAuthStore.getState().setUser(null)

          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }

          throw refreshError
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    await refreshPromise

    return api(originalRequest)
  }
)