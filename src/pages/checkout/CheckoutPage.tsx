import { useCartStore } from "@/store/cartStore"
import { checkout } from "@/api/orders"
import { useNavigate } from "react-router-dom"

export default function CheckoutPage() {

  const { items } = useCartStore()

  const navigate = useNavigate()

  const handleCheckout = async ()=>{

    try{

      await checkout(items)

      useCartStore.setState({items:[]})

      alert("Order placed successfully!")

      navigate("/orders")

    }catch(err){

      alert("Checkout failed")

    }

  }

  const total = items.reduce(
    (sum,item)=>sum + item.price * item.quantity,
    0
  )

  return (

    <div className="px-8 py-12">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Shipping */}

        <div className="space-y-4">

          <input
            placeholder="Full Name"
            className="border w-full p-3 rounded"
          />

          <input
            placeholder="Address"
            className="border w-full p-3 rounded"
          />

          <input
            placeholder="City"
            className="border w-full p-3 rounded"
          />

          <input
            placeholder="Zip Code"
            className="border w-full p-3 rounded"
          />

        </div>

        {/* Summary */}

        <div className="border p-6 rounded-lg h-fit">

          <h2 className="text-xl font-bold mb-4">
            Order Summary
          </h2>

          {items.map((item)=>(
            
            <div
              key={item.id}
              className="flex justify-between mb-2"
            >

              <span>{item.name}</span>

              <span>
                ${item.price * item.quantity}
              </span>

            </div>

          ))}

          <div className="flex justify-between mt-6 font-bold">

            <span>Total</span>

            <span>${total.toFixed(2)}</span>

          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white py-3 rounded-lg mt-6"
          >

            Place Order

          </button>

        </div>

      </div>

    </div>

  )

}