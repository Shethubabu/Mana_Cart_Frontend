import { Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useHome } from "@/hooks/useHome"
import { formatCurrency, getProductImage } from "@/lib/format"

export default function TopRatedProducts() {
  const { data, isLoading } = useHome()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
            Most loved
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Top rated products
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          Simple picks chosen from the highest-rated products in your catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`top-rated-skeleton-${index}`}
                className="h-[260px] animate-pulse rounded-[1.5rem] bg-white"
              />
            ))
          : (data?.topRatedProducts || []).slice(0, 8).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
              >
                <div className="rounded-[1.25rem] bg-[#f7f7fb] p-4">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="mx-auto h-36 w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#edfdf5] px-2.5 py-1 text-xs font-semibold text-[#027a48]">
                      <Star size={12} className="fill-current" />
                      {product.rating?.toFixed(1) || "4.5"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {product.stock > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-900">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-black text-slate-950">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm font-semibold text-[#ff3f6c] transition group-hover:translate-x-1">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}
