import { useState } from "react"
import { Heart, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useProduct } from "@/hooks/useProduct"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/hooks/useCart"
import { useSession } from "@/hooks/useSession"
import { useWishlistStore } from "@/store/wishlistStore"
import ProductCard from "@/components/product/ProductCard"
import { formatCurrency, getDiscountedPrice, getProductImage } from "@/lib/format"

export default function ProductPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [imageIndex, setImageIndex] = useState(0)
  const { user } = useSession()
  const { addToCart } = useCart()
  const { data, isLoading } = useProduct(id || "")
  const { data: products } = useProducts("", "")
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const wishlist = useWishlistStore((state) => state.items)

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">Loading...</div>
  }

  if (!data) {
    return <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">Product not found.</div>
  }

  const images = data.images.length ? data.images : [{ url: getProductImage(data) }]
  const currentImage = images[imageIndex]?.url || getProductImage(data)
  const originalPrice = getDiscountedPrice(data)
  const liked = wishlist.some((item) => item.id === data.id)
  const similarProducts =
    products?.pages
      .flatMap((page) => page.products)
      .filter((product) => product.id !== data.id)
      .slice(0, 4) || []

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    await addToCart({ productId: data.id, quantity: 1 })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[100px_1fr]">
          <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
            {images.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setImageIndex(index)}
                className={`overflow-hidden rounded-[1.25rem] border bg-[#f7f7fb] p-2 ${
                  index === imageIndex ? "border-[#ff3f6c]" : "border-slate-200"
                }`}
              >
                <img
                  src={image.url}
                  alt={`${data.title} ${index + 1}`}
                  className="h-20 w-20 object-contain"
                />
              </button>
            ))}
          </div>

          <div className="order-1 rounded-[1.75rem] bg-[#f7f7fb] p-6 lg:order-2">
            <img
              src={currentImage}
              alt={data.title}
              className="mx-auto h-[460px] w-full object-contain"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
            {data.category?.name || "Fashion"}
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-tight text-slate-950">
            {data.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#edfdf5] px-3 py-1 text-sm font-semibold text-[#027a48]">
              <Star size={14} className="fill-current" />
              {data.rating?.toFixed(1) || "4.5"}
            </span>
            <span className="text-sm text-slate-500">
              {data.reviews?.length || 0} verified reviews
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-black text-slate-950">
              {formatCurrency(data.price)}
            </span>
            {originalPrice && (
              <span className="pb-1 text-lg text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
            {data.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
            >
              <ShoppingBag size={16} />
              Add to bag
            </button>
            <button
              type="button"
              onClick={() =>
                toggleWishlist({
                  id: data.id,
                  name: data.title,
                  price: data.price,
                  image: getProductImage(data)
                })
              }
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                liked
                  ? "border-[#ff3f6c] text-[#ff3f6c]"
                  : "border-slate-200 text-slate-700"
              }`}
            >
              <Heart size={16} />
              Wishlist
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.25rem] bg-[#fff7df] p-4">
              <Truck size={18} className="text-slate-900" />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Fast delivery
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[#eef4ff] p-4">
              <ShieldCheck size={18} className="text-slate-900" />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Secure payments
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[#edfdf5] p-4">
              <Star size={18} className="text-slate-900" />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Premium quality
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <h2 className="text-2xl font-black uppercase text-slate-950">
          Customer reviews
        </h2>
        <div className="mt-6 space-y-5">
          {data.reviews?.length ? (
            data.reviews.map((review, index) => (
              <div
                key={`${review.reviewerName}-${index}`}
                className="rounded-[1.5rem] border border-slate-200 p-5"
              >
                <p className="font-bold text-slate-900">{review.reviewerName}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-black uppercase text-slate-950">
          Similar styles
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
