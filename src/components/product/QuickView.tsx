import { Heart, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { formatCurrency, getDiscountedPrice, getProductImage } from "@/lib/format"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-4xl rounded-[2rem] border-0 bg-white p-6 shadow-2xl sm:max-w-4xl md:p-8">
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
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              {product.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-2xl font-black text-slate-950">
                {formatCurrency(product.price)}
              </span>
              {originalPrice ? (
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="button"
                className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-900"
                onClick={onAddToCart}
              >
                <ShoppingBag size={16} />
                Add to cart
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-12 rounded-full px-6 ${liked ? "border-[#ff3f6c] text-[#ff3f6c]" : ""}`}
                onClick={onToggleWishlist}
              >
                <Heart size={16} className={liked ? "fill-current" : ""} />
                Wishlist
              </Button>
              <Button asChild type="button" variant="outline" className="h-12 rounded-full px-6">
                <Link to={`/product/${product.id}`}>Full details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
