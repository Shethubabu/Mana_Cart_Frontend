import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api/client"
import { useAuthStore } from "@/store/authStore"
import type { CartItem } from "@/lib/types"

export const useCart = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const cartQuery = useQuery<CartItem[]>({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      const response = await api.get("/cart")
      return response.data
    },
    enabled: Boolean(user),
    staleTime: 60 * 1000
  })

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["cart", user?.id]
    })

  const addToCart = useMutation({
    mutationFn: async ({
      productId,
      quantity
    }: {
      productId: number
      quantity: number
    }) => {
      const response = await api.post("/cart/add", {
        productId,
        quantity
      })
      return response.data
    },
    onSuccess: invalidate
  })

  const updateCart = useMutation({
    mutationFn: async ({
      cartId,
      quantity
    }: {
      cartId: number
      quantity: number
    }) => {
      const response = await api.patch("/cart/update", {
        cartId,
        quantity
      })
      return response.data
    },
    onSuccess: invalidate
  })

  const removeItem = useMutation({
    mutationFn: async (cartId: number) => {
      await api.delete(`/cart/remove/${cartId}`)
    },
    onSuccess: invalidate
  })

  const clearCart = useMutation({
    mutationFn: async () => {
      await api.delete("/cart/clear")
    },
    onSuccess: invalidate
  })

  return {
    items: cartQuery.data || [],
    isLoading: cartQuery.isLoading,

    addToCart: addToCart.mutateAsync,
    isAdding: addToCart.isPending,

    updateCart: updateCart.mutateAsync,
    isUpdating: updateCart.isPending,

    removeItem: removeItem.mutateAsync,
    isRemoving: removeItem.isPending,

    clearCart: clearCart.mutateAsync,
    isClearing: clearCart.isPending
  }
}
