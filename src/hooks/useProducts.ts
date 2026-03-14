import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "@/api/client"
import type { ProductListResponse } from "@/lib/types"

export const useProducts = (
  search: string,
  category: string
) => {
  return useInfiniteQuery<ProductListResponse>({
    queryKey: ["products", search, category],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await api.get("/products", {
        params: {
          page: pageParam,
          limit: 20,
          search,
          category
        }
      })

      return res.data
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }

      return undefined
    }
  })
}
