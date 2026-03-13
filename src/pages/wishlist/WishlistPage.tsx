import ProductCard from "@/components/product/ProductCard"
import { useWishlistStore } from "@/store/wishlistStore"
import type { Product } from "@/lib/types"

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)
  const removeWishlistItem = useWishlistStore((state) => state.removeWishlistItem)

  const wishlistProducts: Product[] = items.map((item) => ({
    id: item.id,
    title: item.name,
    description: "Saved to wishlist.",
    price: item.price,
    stock: 10,
    images: [{ url: item.image }]
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
          Wishlist
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase text-slate-950">
          Saved styles
        </h1>

        {wishlistProducts.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCartSuccess={() => removeWishlistItem(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] bg-[#f7f7fb] p-10 text-center text-sm text-slate-500">
            Your wishlist is empty.
          </div>
        )}
      </section>
    </div>
  )
}
