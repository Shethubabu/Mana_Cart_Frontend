import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api/client"
import { useAuthStore } from "@/store/authStore"
import type { Order } from "@/lib/types"

export type CheckoutPayload = {
  paymentMethod: "cod" | "upi" | "razorpay"
  addressId?: number
  upiId?: string
  items?: Array<{
    productId: number
    quantity: number
  }>
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

type ConfirmPaymentPayload = {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

export const useOrders = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const syncPurchaseState = async () => {
    queryClient.setQueryData(["cart", user?.id], [])

    await queryClient.invalidateQueries({
      queryKey: ["orders", user?.id]
    })

    await queryClient.invalidateQueries({
      queryKey: ["cart", user?.id]
    })
  }

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const response = await api.get("/orders")
      return response.data
    },
    enabled: Boolean(user),
    staleTime: 60 * 1000
  })

  const checkout = useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const requestBody = {
        paymentMethod: payload.paymentMethod,
        addressId: payload.addressId,
        upiId: payload.upiId
      }

      const response = await api.post<CheckoutResponse>(
        "/orders/checkout",
        requestBody
      )
      return response.data
    },

    onSuccess: async (_, variables) => {
      if (variables.paymentMethod === "razorpay") return

      await syncPurchaseState()
    }
  })

  const confirmPayment = useMutation({
    mutationFn: async (payload: ConfirmPaymentPayload) => {
      const response = await api.post<Order>(
        "/orders/confirm-payment",
        payload
      )

      return response.data
    },

    onSuccess: async () => {
      await syncPurchaseState()
    }
  })

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,

    checkout: checkout.mutateAsync,
    isCheckingOut: checkout.isPending,

    confirmPayment: confirmPayment.mutateAsync,
    isConfirmingPayment: confirmPayment.isPending
  }
}
