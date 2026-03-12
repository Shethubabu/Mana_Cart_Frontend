import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"

export const useProduct = (id: string) => {

  return useQuery({

    queryKey: ["product", id],

    queryFn: async () => {

      const res = await api.get(`/products/${id}`)

      return res.data

    },

  })

}