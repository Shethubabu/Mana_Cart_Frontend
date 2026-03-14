import { useState } from "react"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "@/hooks/useCart"
import { useSession } from "@/hooks/useSession"
import { formatCurrency, getProductImage } from "@/lib/format"
import { pushToast } from "@/store/toastStore"

export default function CartPage() {
  const navigate = useNavigate()
  const { user } = useSession()
  const { items, isLoading, updateCart, removeItem } = useCart()
  const [pendingItemId, setPendingItemId] = useState<number | null>(null)

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-950">Login to view your cart</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your cart syncs to the backend once you sign in.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Go to login
        </Link>
      </div>
    )
  }

  const subtotal = items.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0
)

const delivery =
  items.length === 0
    ? 0
    : subtotal > 100
    ? 0
    : 1

const total = subtotal + delivery

  const handleQuantityChange = async (cartId: number, quantity: number) => {
    try {
      setPendingItemId(cartId)
      await updateCart({ cartId, quantity })
    } catch {
      pushToast({
        tone: "error",
        title: "Could not update cart",
        description: "Please try again."
      })
    } finally {
      setPendingItemId(null)
    }
  }

  const handleRemove = async (cartId: number) => {
    try {
      setPendingItemId(cartId)
      await removeItem(cartId)
      pushToast({
        tone: "success",
        title: "Item removed from cart"
      })
    } catch {
      pushToast({
        tone: "error",
        title: "Could not remove item",
        description: "Please try again."
      })
    } finally {
      setPendingItemId(null)
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
              Shopping cart
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              {items.length} item{items.length === 1 ? "" : "s"}
            </h1>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading your cart...</p>
        ) : items.length ? (
          <div className="space-y-5">
            {items.map((item) => {
              const isPending = pendingItemId === item.id

              return (
                <article
                  key={item.id}
                  className="grid gap-5 rounded-[1.5rem] border border-slate-200 p-4 md:grid-cols-[120px_1fr_auto]"
                >
                  <div className="rounded-[1.25rem] bg-[#f7f7fb] p-3">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product.title}
                      className="h-28 w-full object-contain"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.product.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.product.category?.name || "General"}
                    </p>
                    <p className="mt-4 text-xl font-black text-slate-950">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-4 md:items-end">
                    <div className="inline-flex items-center rounded-full border border-slate-200 p-1">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          if (item.quantity <= 1) {
                            void handleRemove(item.id)
                            return
                          }

                          void handleQuantityChange(item.id, item.quantity - 1)
                        }}
                        className="rounded-full p-2 text-slate-700 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => void handleQuantityChange(item.id, item.quantity + 1)}
                        className="rounded-full p-2 text-slate-700 disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => void handleRemove(item.id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff3f6c] disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                      {isPending ? "Updating..." : "Remove"}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[1.75rem] bg-[#f7f7fb] p-10 text-center">
            <ShoppingBag className="mx-auto text-slate-400" size={28} />
            <h2 className="mt-4 text-2xl font-black text-slate-950">Your cart is empty</h2>
            <p className="mt-2 text-sm text-slate-500">
              Add products to your cart to review them here.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </section>

      <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
          Price details
        </p>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{delivery === 0 ? "FREE" : formatCurrency(delivery)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-950">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!items.length}
          onClick={() => navigate("/checkout")}
          className="mt-8 w-full rounded-full bg-[#ff3f6c] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Proceed to checkout
        </button>
      </aside>
    </div>
  )
}
