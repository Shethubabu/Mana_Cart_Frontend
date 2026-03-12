import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api/client"
import { useAuthStore } from "@/store/authStore"
import type { Order } from "@/lib/types"

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
    mutationFn: async () => {
      const response = await api.post("/orders/checkout")
      return response.data
    },
    onSuccess: async () => {
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
