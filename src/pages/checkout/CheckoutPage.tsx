import { useState } from "react"
import { CreditCard, CheckCircle2, Circle } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useCart } from "@/hooks/useCart"
import { useOrders } from "@/hooks/useOrders"
import { formatCurrency } from "@/lib/format"

const paymentMethods = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your order arrives at your doorstep."
  },
  {
    id: "upi",
    title: "UPI",
    description: "Pay using PhonePe, Google Pay, Paytm, or any UPI app."
  },
  {
    id: "stripe",
    title: "Stripe",
    description: "Pay securely with cards, Apple Pay, Google Pay, and more."
  }
] as const

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { items } = useCart()
  const { checkout, isCheckingOut } = useOrders()
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof paymentMethods)[number]["id"]>("cod")
  const [upiId, setUpiId] = useState("")
  const paymentCancelled = searchParams.get("payment") === "cancelled"

  const subtotal = items.reduce(
    (sum, item) => sum +( item.product.price) * item.quantity,
    0
  )
  const delivery = subtotal > 999 ? 0 : 99
  const total = subtotal + delivery

  const placeOrder = async () => {
    if (paymentMethod === "upi" && !upiId.trim()) {
      return
    }

    const origin = window.location.origin
    const response = await checkout({
      paymentMethod,
      upiId: paymentMethod === "upi" ? upiId.trim() : undefined,
      successUrl:
        paymentMethod === "stripe"
          ? `${origin}/orders?payment=success`
          : undefined,
      cancelUrl:
        paymentMethod === "stripe"
          ? `${origin}/checkout?payment=cancelled`
          : undefined
    })

    if (paymentMethod === "stripe") {
      if (!response?.checkoutUrl) {
        throw new Error("Stripe checkout session URL was not returned.")
      }

      window.location.assign(response.checkoutUrl)
      return
    }

    navigate("/orders")
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <p className="text-xs font-bold text-[#ff3f6c]">Checkout</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Confirm your order
        </h1>

        {paymentCancelled && (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Stripe checkout was cancelled. Your cart is still intact.
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Delivery address</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              221 Fashion Street
              <br />
              Hyderabad, Telangana
              <br />
              India
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Payment method</h2>
            <div className="mt-4 space-y-3">
              {paymentMethods.map((method) => {
                const selected = paymentMethod === method.id

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#ff3f6c] bg-[#fff2f5]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {selected ? (
                      <CheckCircle2 className="mt-0.5 text-[#ff3f6c]" size={18} />
                    ) : (
                      <Circle className="mt-0.5 text-slate-400" size={18} />
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{method.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {method.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {paymentMethod === "upi" && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  UPI ID
                </label>
                <input
                  value={upiId}
                  onChange={(event) => setUpiId(event.target.value)}
                  placeholder="example@upi"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />
              </div>
            )}

            {paymentMethod === "stripe" && (
              <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <CreditCard size={16} />
                  Hosted by Stripe
                </div>
                <p className="mt-2 leading-6">
                  You will be redirected to Stripe Checkout to complete payment
                  securely and then returned to ManaCart.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <h2 className="text-xl font-black tracking-tight text-slate-950">
          Order total
        </h2>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{items.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment</span>
            <span>
              {paymentMethod === "cod"
                ? "Cash on Delivery"
                : paymentMethod === "upi"
                  ? "UPI"
                  : "Stripe"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{delivery === 0 ? "FREE" : formatCurrency(delivery)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-950">
            <span>Total payable</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {paymentMethod === "upi" && !upiId.trim() && (
          <p className="mt-4 text-sm text-[#ff3f6c]">
            Enter a valid UPI ID to continue.
          </p>
        )}

        <button
          type="button"
          disabled={
            !items.length || isCheckingOut || (paymentMethod === "upi" && !upiId.trim())
          }
          onClick={placeOrder}
          className="mt-8 w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCheckingOut
            ? paymentMethod === "stripe"
              ? "Redirecting to Stripe..."
              : "Placing order..."
            : paymentMethod === "stripe"
              ? "Pay with Stripe"
              : "Place order"}
        </button>
      </aside>
    </div>
  )
}
