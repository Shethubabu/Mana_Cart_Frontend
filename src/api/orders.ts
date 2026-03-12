import { api } from "./client"

export const checkout = async (items:any[]) => {

  const res = await api.post("/orders/checkout", {

    items

  })

  return res.data

}