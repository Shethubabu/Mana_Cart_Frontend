import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"
import type { Product } from "@/lib/types"

export const useProduct = (id: string) => {

  return useQuery<Product>({

    queryKey: ["product", id],

    queryFn: async () => {

      const res = await api.get(`/products/${id}`)

      return res.data

    },

    enabled: Boolean(id)

  })

}
