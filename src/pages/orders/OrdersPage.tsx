import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/client"

export default function OrdersPage() {

  const { data, isLoading } = useQuery({

    queryKey:["orders"],

    queryFn:async()=>{

      const res = await api.get("/orders")

      return res.data

    }

  })

  if(isLoading) return <div className="p-10">Loading...</div>

  return (

    <div className="px-8 py-12">

      <h1 className="text-3xl font-bold mb-8">
        Your Orders
      </h1>

      <div className="space-y-6">

        {data.map((order:any)=>(
          
          <div
            key={order.id}
            className="border p-6 rounded-lg"
          >

            <p className="font-semibold">
              Order #{order.id}
            </p>

            <p className="text-gray-500">
              Status: {order.status}
            </p>

            <p className="font-bold">
              Total: ${order.total}
            </p>

          </div>

        ))}

      </div>

    </div>

  )

}