import { Heart, ShoppingBag, X } from "lucide-react"
import { Link } from "react-router-dom"
import { formatCurrency, getDiscountedPrice, getProductImage } from "@/lib/format"
import type { Product } from "@/lib/types"

export default function QuickView({
  product,
  liked,
  onToggleWishlist,
  onAddToCart,
  close
}: {
  product: Product
  liked: boolean
  onToggleWishlist: () => void
  onAddToCart: () => void
  close: () => void
}) {
  const originalPrice = getDiscountedPrice(product)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-4xl rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-slate-200 p-2 text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[1.75rem] bg-[#f7f7fb] p-6">
            <img
              src={getProductImage(product)}
              alt={product.title}
              className="mx-auto h-[320px] w-full object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#ff3f6c]">
              Quick view
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase text-slate-950">
              {product.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-2xl font-black text-slate-950">
                {formatCurrency(product.price )}
              </span>
              {originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(originalPrice )}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onAddToCart}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
              >
                <ShoppingBag size={16} />
                Add to cart
              </button>
              <button
                type="button"
                onClick={onToggleWishlist}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] ${
                  liked
                    ? "border-[#ff3f6c] text-[#ff3f6c]"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                <Heart size={16} />
                Wishlist
              </button>
              <Link
                to={`/product/${product.id}`}
                className="inline-flex items-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700"
              >
                Full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
