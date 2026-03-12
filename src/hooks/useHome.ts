import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"
import type { HomeData } from "@/lib/types"

export const useHome = () => {

  return useQuery<HomeData>({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await api.get("/home")
      return res.data
    }
  })

}
