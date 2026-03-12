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
  removeFromCart:(id:number)=>void
  increase:(id:number)=>void
  decrease:(id:number)=>void
  clearCart:()=>void
}

export const useCartStore = create<CartState>((set,get)=>({

  items:[],

  addToCart:(product)=>{

    const exists = get().items.find(p=>p.id===product.id)

    if(exists){

      set({
        items:get().items.map(p=>
          p.id===product.id
            ? {...p,quantity:p.quantity+1}
            : p
        )
      })

    }else{

      set({
        items:[...get().items,{...product,quantity:1}]
      })

    }

  },

  removeFromCart:(id)=>{

    set({
      items:get().items.filter(p=>p.id!==id)
    })

  },

  increase:(id)=>{

    set({
      items:get().items.map(p=>
        p.id===id
          ? {...p,quantity:p.quantity+1}
          : p
      )
    })

  },

  decrease:(id)=>{

    set({
      items:get().items
        .map(p=>
          p.id===id
            ? {...p,quantity:p.quantity-1}
            : p
        )
        .filter(p=>p.quantity>0)
    })

  },

  clearCart:()=>set({items:[]})

}))