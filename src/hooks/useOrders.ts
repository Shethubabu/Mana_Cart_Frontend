import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api/client"
import { useAuthStore } from "@/store/authStore"
import type { Order } from "@/lib/types"

export type CheckoutPayload = {
  paymentMethod: "cod" | "upi" | "razorpay"
  addressId?: number
  upiId?: string
}

type CheckoutResponse = {
  key?: string
  keyId?: string
  razorpayKey?: string
  razorpayKeyId?: string
  orderId?: string
  order_id?: string
  razorpayOrderId?: string
  amount?: number
  currency?: string
  name?: string
  description?: string
  image?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  order?: {
    id?: string
    amount?: number
    currency?: string
  }
}

export const useOrders = () => {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders")
      return response.data
    },
    enabled: Boolean(accessToken)
  })

  const checkout = useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const response = await api.post<CheckoutResponse>("/orders/checkout", payload)
      return response.data
    },
    onSuccess: async (_, variables) => {
      if (variables.paymentMethod === "razorpay") {
        return
      }

      await queryClient.invalidateQueries({ queryKey: ["orders"] })
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
    }
  })

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    checkout: checkout.mutateAsync,
    isCheckingOut: checkout.isPending
  }
}
