import { api } from "./client"

export const addToCart = (productId:number,qty:number)=>{
  return api.post("/cart",{productId,qty})
}

export const getCart = ()=>{
  return api.get("/cart")
}

export const removeCart = (id:number)=>{
  return api.delete(`/cart/${id}`)
}