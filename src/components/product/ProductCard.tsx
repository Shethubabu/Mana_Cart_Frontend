import { useState } from "react"
import { Heart, Star } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import QuickView from "./QuickView"
import { useWishlistStore } from "@/store/wishlistStore"
import { useCart } from "@/hooks/useCart"
import { useSession } from "@/hooks/useSession"
import { formatCurrency, getDiscountedPrice, getProductImage } from "@/lib/format"
import type { Product } from "@/lib/types"
import { pushToast } from "@/store/toastStore"

export default function ProductCard({
  product,
  onAddToCartSuccess
}: {
  product: Product
  onAddToCartSuccess?: () => void
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { user, isLoadingUser } = useSession()
  const { addToCart } = useCart()
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const wishlist = useWishlistStore((state) => state.items)
  const [isAdding, setIsAdding] = useState(false)

  const liked = wishlist.some((item) => item.id === product.id)
  const originalPrice = getDiscountedPrice(product)

  const handleWishlistToggle = () => {
    const nextLiked = !liked

    toggleWishlist({
      id: product.id,
      name: product.title,
      price: product.price,
      image: getProductImage(product)
    })

    pushToast({
      tone: "success",
      title: nextLiked ? "Saved to wishlist" : "Removed from wishlist",
      description: product.title
    })
  }

  const handleAddToCart = async () => {
    if (isLoadingUser) {
      pushToast({
        tone: "info",
        title: "Checking your session",
        description: "Please wait a moment and try again."
      })
      return
    }

    if (!user) {
      pushToast({
        tone: "info",
        title: "Login required",
        description: "Sign in to add products to your cart."
      })
      navigate("/login")
      return
    }

    try {
      setIsAdding(true)
      await addToCart({ productId: product.id, quantity: 1 })
      onAddToCartSuccess?.()
      pushToast({
        tone: "success",
        title: "Added to cart",
        description: product.title
      })
    } catch {
      pushToast({
        tone: "error",
        title: "Could not add to cart",
        description: "Please try again."
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="relative overflow-hidden bg-[#f7f7fb] p-5">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-sm"
          >
            <Heart
              size={18}
              className={liked ? "fill-[#ff3f6c] text-[#ff3f6c]" : "text-slate-500"}
            />
          </button>

          {product.discountPercentage ? (
            <span className="absolute left-4 top-4 rounded-full bg-[#ff3f6c] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              {Math.round(product.discountPercentage)}% off
            </span>
          ) : null}

          <Link to={`/product/${product.id}`}>
            <img
              src={getProductImage(product)}
              alt={product.title}
              className="mx-auto h-[240px] w-full object-contain transition duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 uppercase tracking-[0.16em] text-slate-700">
              {product.category?.name || "General"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#edfdf5] px-2.5 py-1 text-[#027a48]">
              <Star size={12} className="fill-current" />
              {product.rating?.toFixed(1) || "4.4"}
            </span>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="min-h-12 text-base font-bold leading-6 text-slate-900">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-end gap-2">
            <span className="text-xl font-black text-slate-950">
              {formatCurrency(product.price)}
            </span>
            {originalPrice ? (
              <span className="pb-0.5 text-sm text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            ) : null}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAdding ? "Adding..." : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              View
            </button>
          </div>
        </div>
      </article>

      {open ? (
        <QuickView
          product={product}
          liked={liked}
          onToggleWishlist={handleWishlistToggle}
          onAddToCart={handleAddToCart}
          close={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
