import { create } from "zustand"

interface CartItem {
  id:number
  name:string
  price:number
  image:string
  quantity:number
}

interface CartState {

  items:CartItem[]

  addToCart:(product:CartItem)=>void

}

export const useCartStore = create<CartState>((set)=>({

  items:[],

  addToCart:(product)=>{

    set((state)=>({

      items:[...state.items,product]

    }))

  }

}))