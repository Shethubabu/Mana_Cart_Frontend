import { create } from "zustand"

export type ToastTone = "success" | "error" | "info"

export interface ToastItem {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastState {
  items: ToastItem[]
  push: (toast: Omit<ToastItem, "id">) => number
  dismiss: (id: number) => void
}

let toastId = 0

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (toast) => {
    const id = ++toastId

    set((state) => ({
      items: [...state.items, { ...toast, id }]
    }))

    window.setTimeout(() => {
      useToastStore.getState().dismiss(id)
    }, 3200)

    return id
  },
  dismiss: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    }))
}))

export const pushToast = (toast: Omit<ToastItem, "id">) =>
  useToastStore.getState().push(toast)
