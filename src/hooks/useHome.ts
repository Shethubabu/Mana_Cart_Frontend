import { useQuery } from "@tanstack/react-query"
import { api } from "../api/client"

export const useHome = () => {

  return useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await api.get("/home")
      return res.data
    }
  })

}