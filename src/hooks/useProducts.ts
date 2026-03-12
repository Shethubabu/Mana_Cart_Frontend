import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/client"

export const useProducts = (
  search?: string,
  category?: string
) => {

  return useQuery({

    queryKey: ["products", search, category],

    queryFn: async () => {

      const res = await api.get("/products", {
        params: {
          search,
          category
        }
      })

      return res.data.products

    }

  })

}