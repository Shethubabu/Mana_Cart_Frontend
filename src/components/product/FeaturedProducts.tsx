import ProductCard from "./ProductCard"
import { useHome } from "@/hooks/useHome"

export default function FeaturedProducts() {

  const { data, isLoading } = useHome()

  if (isLoading) return <div className="p-10">Loading...</div>

  return (

    <section className="py-16 px-8">

      <h2 className="text-3xl font-bold mb-10 text-center">
        Featured Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        {data.featuredProducts.map((product:any)=>(
          
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.title,
              price: product.price,
              image: product.images?.[0]?.url
            }}
          />

        ))}

      </div>

    </section>

  )

}