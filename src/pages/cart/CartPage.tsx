import { useCartStore } from "@/store/cartStore"
import { Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function CartPage() {

  const { items, addToCart } = useCartStore()

  const removeItem = (id:number)=>{

    useCartStore.setState({
      items: items.filter((item)=>item.id !== id)
    })

  }

  const increase = (product:any)=>{

    addToCart({
      ...product,
      quantity:1
    })

  }

  const decrease = (id:number)=>{

    useCartStore.setState({
      items: items
        .map((item)=> item.id === id
          ? {...item, quantity: item.quantity - 1}
          : item
        )
        .filter((item)=> item.quantity > 0)
    })

  }

  const total = items.reduce(
    (sum,item)=>sum + item.price * item.quantity,
    0
  )

  return (

    <div className="px-8 py-12">

      <h1 className="text-3xl font-bold mb-8">
        Your Cart
      </h1>

      {items.length === 0 && (

        <p className="text-gray-500">
          Your cart is empty
        </p>

      )}

      <div className="grid md:grid-cols-3 gap-10">

        {/* Cart Items */}

        <div className="md:col-span-2 space-y-6">

          {items.map((item)=>(
            
            <div
              key={item.id}
              className="flex gap-6 border p-4 rounded-lg"
            >

              <img
                src={item.image}
                className="w-[120px] h-[120px] object-cover rounded"
              />

              <div className="flex flex-col justify-between flex-1">

                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>

                <p className="text-gray-500">
                  ${item.price}
                </p>

                {/* Quantity */}

                <div className="flex items-center gap-3">

                  <button
                    onClick={()=>decrease(item.id)}
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={()=>increase(item)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* Remove */}

              <button
                onClick={()=>removeItem(item.id)}
                className="text-red-500"
              >
                <Trash2/>
              </button>

            </div>

          ))}

        </div>

        {/* Cart Summary */}

        <div className="border p-6 rounded-lg h-fit">

          <h2 className="text-xl font-bold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-3">

            <span>Total</span>

            <span className="font-semibold">
              ${total.toFixed(2)}
            </span>

        </div>

            <Link to="/checkout">

                    <button className="w-full bg-orange-500 text-white py-3 rounded-lg mt-4">
                        Checkout
                    </button>

            </Link>

        </div>

      </div>

    </div>

  )

}