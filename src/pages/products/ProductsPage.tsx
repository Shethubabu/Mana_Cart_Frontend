import { useProducts } from "@/hooks/useProducts"
import ProductCard from "@/components/product/ProductCard"
import { useHome } from "@/hooks/useHome"
import { useState } from "react"

export default function ProductsPage() {

  const { data:home } = useHome()

  const [category,setCategory] = useState("")

  const { data,isLoading } = useProducts("",category)

  const categories = home?.categories || []

  if(isLoading) return <div className="p-10">Loading...</div>

  return (

    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}

      <div className="w-[260px] bg-white p-6 border-r hidden md:block">

        <h2 className="font-bold mb-6 text-lg">
          Filters
        </h2>

        <div className="space-y-4">

          {categories.map((cat:any)=>(
            
            <div
              key={cat.id}
              onClick={()=>setCategory(cat.name)}
              className="cursor-pointer hover:text-orange-500"
            >

              {cat.name}

            </div>

          ))}

        </div>

      </div>

      {/* Products */}

      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">
          Products
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {data.map((product:any)=>(
            
            <ProductCard
              key={product.id}
              product={{
                id:product.id,
                name:product.title,
                price:product.price,
                image:product.images?.[0]?.url
              }}
            />

          ))}

        </div>

      </div>

    </div>

  )

}