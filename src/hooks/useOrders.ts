import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api/client"
import { useAuthStore } from "@/store/authStore"
import type { Order } from "@/lib/types"

export type CheckoutPayload = {
  paymentMethod: "cod" | "upi" | "stripe"
  addressId?: number
  upiId?: string
  successUrl?: string
  cancelUrl?: string
}

type CheckoutResponse = {
  checkoutUrl?: string
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
      if (variables.paymentMethod === "stripe") {
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
