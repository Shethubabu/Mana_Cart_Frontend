import { useEffect, useRef } from "react"
import { useHome } from "@/hooks/useHome"
import { useProducts } from "@/hooks/useProducts"
import { useSearchStore } from "@/store/searchStore"
import ProductCard from "@/components/product/ProductCard"
import FilterDrawer from "@/components/filter/FilterDrawer"

export default function ProductsPage() {
  const loader = useRef<HTMLDivElement | null>(null)
  const { data: home } = useHome()
  const { search, category } = useSearchStore()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProducts(search, category)

  const products = data?.pages.flatMap((page) => page.products) || []

  useEffect(() => {
    const currentLoader = loader.current

    if (!currentLoader) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(currentLoader)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <FilterDrawer categories={home?.categories || []} />

      <div className="rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
              Collection
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase text-slate-950">
              {category || "All products"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {search
                ? `Showing results for "${search}".`
                : "Browse the full ManaCart catalog."}
            </p>
          </div>

          <div className="rounded-full bg-[#fff1f4] px-4 py-2 text-sm font-semibold text-[#ff3f6c]">
            {products.length} styles loaded
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`product-skeleton-${index}`}
                  className="h-[380px] animate-pulse rounded-[1.75rem] bg-[#f5f7fb]"
                />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!isLoading && products.length === 0 && (
          <div className="rounded-[1.75rem] bg-[#f7f7fb] p-10 text-center">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              No products found
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Try another search term or switch categories.
            </p>
          </div>
        )}

        <div ref={loader} className="mt-8 flex h-10 items-center justify-center">
          {isFetchingNextPage && (
            <p className="text-sm font-medium text-slate-500">
              Loading more styles...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
