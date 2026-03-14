import { create } from "zustand"

interface WishlistItem {
  id:number
  name:string
  price:number
  image:string
}

interface WishlistState {
  items:WishlistItem[]
  toggleWishlist:(item:WishlistItem)=>void
  removeWishlistItem:(id:number)=>void
}

export const useWishlistStore = create<WishlistState>((set,get)=>({

  items:[],

  toggleWishlist:(item)=>{

    const exists = get().items.find(p=>p.id===item.id)

    if(exists){

      set({
        items:get().items.filter(p=>p.id!==item.id)
      })

    }else{

      set({
        items:[...get().items,item]
      })

    }

  },

  removeWishlistItem:(id)=>{
    set({
      items:get().items.filter(p=>p.id!==id)
    })
  }

}))
