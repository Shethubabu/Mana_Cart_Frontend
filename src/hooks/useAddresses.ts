import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api/client"
import { useAuthStore } from "@/store/authStore"

export interface Address {
  id: number
  name: string
  phone: string
  pincode: string
  locality: string
  city: string
  state: string
  addressLine: string
  landmark?: string
  type: string
}

interface AddressApiRecord {
  id: number
  name: string
  phone: string
  pincode: string
  locality: string
  city: string
  state: string
  addressLine: string
  landmark?: string
  type: string
}

type AddressPayload = Omit<Address, "id">

const normalizeAddress = (address: AddressApiRecord): Address => ({
  id: address.id,
  name: address.name,
  phone: address.phone,
  pincode: address.pincode,
  locality: address.locality,
  city: address.city,
  state: address.state,
  addressLine: address.addressLine,
  landmark: address.landmark,
  type: address.type
})

export const useAddresses = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const addressQuery = useQuery({
    queryKey: ["addresses",user?.id],
    queryFn: async () => {
      const res = await api.get("/addresses")
      return (res.data as AddressApiRecord[]).map(normalizeAddress)
    },
    enabled: Boolean(user)
  })

  const createAddress = useMutation({
    mutationFn: (data: AddressPayload) =>
      api.post("/addresses", data),
      onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] })

   
  })

  const updateAddress = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number
      data: AddressPayload
    }) => api.put(`/addresses/${id}`, data),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] })
  })

  const deleteAddress = useMutation({
    mutationFn: (id: number) => api.delete(`/addresses/${id}`),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] })
  })

  return {
    addresses: addressQuery.data || [],
    isLoading: addressQuery.isLoading,
    createAddress: createAddress.mutateAsync,
    isCreating: createAddress.isPending,
    updateAddress: updateAddress.mutateAsync,
    isUpdating: updateAddress.isPending,
    deleteAddress: deleteAddress.mutateAsync
  }
}