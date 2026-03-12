import { useHome } from "@/hooks/useHome"
import ProductCard from "./ProductCard"

export default function FeaturedProducts() {
  const { data, isLoading } = useHome()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-black text-[#ff3f6c]">
            Trending
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Featured drops
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[380px] animate-pulse rounded-[1.75rem] bg-white"
              />
            ))
          : (data?.featuredProducts || []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  )
}
