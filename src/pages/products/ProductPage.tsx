import { useParams } from "react-router-dom"
import { useProduct } from "@/hooks/useProduct"
import { useProducts } from "@/hooks/useProducts"
import ProductCard from "@/components/product/ProductCard"
import { useCartStore } from "@/store/cartStore"
import { useState } from "react"

export default function ProductPage(){

  const { id } = useParams()

  const { data,isLoading } = useProduct(id!)

  const { data:products } = useProducts()

  const addToCart = useCartStore((state)=>state.addToCart)

  const [image,setImage] = useState<string>()

  if(isLoading) return <div className="p-10">Loading...</div>

  const currentImage = image || data.images?.[0]?.url

  return(

    <div className="bg-gray-100 min-h-screen p-10">

      <div className="bg-white p-8 grid md:grid-cols-2 gap-12">

        {/* Image Gallery */}

        <div>

          <img
            src={currentImage}
            className="w-full h-[420px] object-contain border rounded-lg"
          />

          {/* Thumbnails */}

          <div className="flex gap-3 mt-6 flex-wrap">

            {data.images?.map((img:any,index:number)=>(
              
              <img
                key={index}
                src={img.url}
                onClick={()=>setImage(img.url)}
                className="w-[80px] h-[80px] object-cover border cursor-pointer hover:border-orange-500"
              />

            ))}

          </div>

        </div>

        {/* Product Info */}

        <div>

          <h1 className="text-2xl font-semibold">

            {data.title}

          </h1>

          <p className="text-gray-500 mt-4">

            {data.description}

          </p>

          <p className="text-3xl font-bold mt-6">

            ${data.price}

          </p>

          <p className="text-green-600 mt-2">

            Special Offer Available

          </p>

          <div className="flex gap-4 mt-8">

            <button
              onClick={()=>addToCart({
                id:data.id,
                name:data.title,
                price:data.price,
                image:data.images?.[0]?.url,
                quantity:1
              })}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg"
            >
              Add to Cart
            </button>

            <button className="bg-green-600 text-white px-8 py-3 rounded-lg">
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* Similar Products */}

      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-6">
          Similar Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

          {products?.slice(0,5).map((p:any)=>(
            
            <ProductCard
              key={p.id}
              product={{
                id:p.id,
                name:p.title,
                price:p.price,
                image:p.images?.[0]?.url
              }}
            />

          ))}

        </div>

      </div>

    </div>

  )

}