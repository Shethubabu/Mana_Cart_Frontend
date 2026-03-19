import { Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useHome } from "@/hooks/useHome"
import {
  formatCurrency,
  getCategoryName,
  getDiscountedPrice,
  getProductImage
} from "@/lib/format"

export default function FeaturedProducts() {
  const { data, isLoading } = useHome()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c89b3c]">
          Featured picks
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Featured products
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Curated products with a cleaner premium card treatment using black and gold
          accents.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`featured-skeleton-${index}`}
                className="h-[380px] animate-pulse rounded-[1.75rem] bg-white"
              />
            ))
          : (data?.featuredProducts || []).map((product) => {
              const originalPrice = getDiscountedPrice(product)

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-[#2a2a2a] bg-[linear-gradient(180deg,#111111_0%,#1a1a1a_100%)] shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.18)]"
                >
                  <div className="relative overflow-hidden border-b border-[#2f2a1f] bg-[radial-gradient(circle_at_top,rgba(200,155,60,0.26),transparent_45%),linear-gradient(180deg,#1b1b1b_0%,#121212_100%)] p-5">
                    {product.discountPercentage ? (
                      <span className="absolute left-4 top-4 rounded-full bg-[#c89b3c] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#111111]">
                        {Math.round(product.discountPercentage)}% off
                      </span>
                    ) : null}

                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="mx-auto h-[220px] w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-3 p-5 text-white">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="rounded-full border border-[#3f3621] bg-[#191714] px-3 py-1 font-semibold uppercase tracking-[0.16em] text-[#e7c97a]">
                        {getCategoryName(product)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#f4d58d]">
                        <Star className="size-3 fill-current" />
                        {product.rating?.toFixed(1) || "4.4"}
                      </span>
                    </div>

                    <h3 className="min-h-12 text-base font-bold leading-6 text-white">
                      {product.title}
                    </h3>

                    <div className="flex items-end gap-2">
                      <span className="text-xl font-black text-white">
                        {formatCurrency(product.price)}
                      </span>
                      {originalPrice ? (
                        <span className="pb-0.5 text-sm text-[#8f8f8f] line-through">
                          {formatCurrency(originalPrice)}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#2d2d2d] pt-3 text-sm">
                      <span className="text-[#d5b66b]">
                        {product.stock > 0 ? "Ready to ship" : "Check availability"}
                      </span>
                      <span className="font-semibold text-white transition group-hover:text-[#f4d58d]">
                        View product
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
      </div>
    </section>
  )
}
