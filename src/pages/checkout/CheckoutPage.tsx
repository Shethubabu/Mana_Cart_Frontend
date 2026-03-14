import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, CreditCard, MapPin, Smartphone, Truck } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useCart } from "@/hooks/useCart"
import { useOrders } from "@/hooks/useOrders"
import { useAddresses } from "@/hooks/useAddresses"
import { formatCurrency } from "@/lib/format"
import { upiSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { pushToast } from "@/store/toastStore"

const paymentMethods = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay after the order reaches your doorstep.",
    icon: Truck
  },
  {
    id: "upi",
    title: "UPI",
    description: "Use PhonePe, GPay, Paytm, or any UPI app.",
    icon: Smartphone
  },
  {
    id: "stripe",
    title: "Cards and online payment",
    description: "Pay securely using Stripe Checkout.",
    icon: CreditCard
  }
] as const

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { items } = useCart()
  const { addresses, isLoading: isLoadingAddresses } = useAddresses()
  const { checkout, isCheckingOut } = useOrders()
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof paymentMethods)[number]["id"]>("cod")
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [upiId, setUpiId] = useState("")
  const [upiError, setUpiError] = useState("")
  const paymentCancelled = searchParams.get("payment") === "cancelled"

  useEffect(() => {
    if (!addresses.length) {
      setSelectedAddressId(null)
      return
    }

    setSelectedAddressId((current) =>
      current && addresses.some((address) => address.id === current)
        ? current
        : addresses[0].id
    )
  }, [addresses])

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const delivery = subtotal > 999 ? 0 : 99
  const total = subtotal + delivery
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)
  const selectedPayment = paymentMethods.find((method) => method.id === paymentMethod)
  const upiValidation = upiSchema.safeParse({ upiId })
  const hasValidUpi = upiValidation.success
  const validatedUpiId = hasValidUpi ? upiValidation.data.upiId : undefined

  const orderSummary = useMemo(
    () =>
      items.slice(0, 3).map((item) => ({
        id: item.id,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price
      })),
    [items]
  )

  const placeOrder = async () => {
    if (!selectedAddress) {
      pushToast({
        tone: "info",
        title: "Select a delivery address",
        description: "Choose one of your saved addresses before placing the order."
      })
      return
    }

    if (paymentMethod === "upi" && !upiId.trim()) {
      pushToast({
        tone: "info",
        title: "Enter your UPI ID",
        description: "A valid UPI ID is required for this payment option."
      })
      return
    }

    if (paymentMethod === "upi" && !hasValidUpi) {
      setUpiError(
        upiValidation.error.issues[0]?.message ||
          "Enter a valid UPI ID before continuing."
      )
      pushToast({
        tone: "info",
        title: "UPI ID is invalid",
        description: "Enter a valid UPI ID such as yourname@oksbi."
      })
      return
    }

    try {
      const origin = window.location.origin
      const response = await checkout({
        addressId: selectedAddress.id,
        paymentMethod,
        upiId: paymentMethod === "upi" ? validatedUpiId : undefined,
        successUrl:
          paymentMethod === "stripe" ? `${origin}/orders?payment=success` : undefined,
        cancelUrl:
          paymentMethod === "stripe"
            ? `${origin}/checkout?payment=cancelled`
            : undefined
      })

      if (paymentMethod === "stripe") {
        if (!response?.checkoutUrl) {
          throw new Error("Stripe checkout session URL was not returned.")
        }

        pushToast({
          tone: "info",
          title: "Redirecting to payment gateway"
        })
        window.location.assign(response.checkoutUrl)
        return
      }

      pushToast({
        tone: "success",
        title: "Order placed successfully",
        description: "You can track it from your orders page."
      })
      navigate("/orders")
    } catch {
      pushToast({
        tone: "error",
        title: "Checkout failed",
        description: "Please verify your payment choice and try again."
      })
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-950">Your cart is empty</h1>
        <p className="mt-3 text-sm text-slate-600">
          Add a few products before moving to checkout.
        </p>
        <Button asChild className="mt-6 rounded-full bg-slate-950 px-6 text-white">
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-6">
      <section className="space-y-6">
        <Card className="rounded-[2rem] border-0 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
          <CardHeader className="space-y-3 p-6 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ff3f6c]">
              Checkout
            </p>
            <CardTitle className="text-3xl font-black text-slate-950">
              Delivery and payment
            </CardTitle>
            <p className="text-sm leading-7 text-slate-600">
              Choose a saved address, pick a payment method, and confirm the order.
            </p>
            {paymentCancelled ? (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Online payment was cancelled. Your cart is still available.
              </div>
            ) : null}
          </CardHeader>
        </Card>

        <Card className="rounded-[2rem] border-0 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
          <CardHeader className="p-6 pb-4 lg:p-8 lg:pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-slate-950">
                  Delivery address
                </CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Your order will be delivered to one of your saved addresses.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/profile">Manage addresses</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0 lg:p-8 lg:pt-0">
            {isLoadingAddresses ? (
              <p className="text-sm text-slate-500">Loading saved addresses...</p>
            ) : addresses.length ? (
              addresses.map((address) => {
                const active = address.id === selectedAddressId

                return (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                      active
                        ? "border-[#ff3f6c] bg-[#fff2f5]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-base font-bold text-slate-950">
                            {address.name}
                          </p>
                          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                            {address.type}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {address.addressLine}, {address.locality}, {address.city},{" "}
                          {address.state} - {address.pincode}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Phone: {address.phone}
                          {address.landmark ? ` | Landmark: ${address.landmark}` : ""}
                        </p>
                      </div>
                      {active ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#ff3f6c]">
                          <CheckCircle2 size={16} />
                          Selected
                        </div>
                      ) : null}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
                <MapPin className="mx-auto text-slate-400" size={22} />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No saved addresses found.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Add an address in your profile before placing the order.
                </p>
                <Button asChild className="mt-5 rounded-full bg-slate-950 text-white">
                  <Link to="/profile">Add address</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
          <CardHeader className="p-6 pb-4 lg:p-8 lg:pb-4">
            <CardTitle className="text-xl font-black text-slate-950">
              Payment method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0 lg:p-8 lg:pt-0">
            <div className="grid gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const selected = paymentMethod === method.id

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.id)
                      setUpiError("")
                    }}
                    className={`flex items-start gap-4 rounded-[1.5rem] border p-5 text-left transition ${
                      selected
                        ? "border-[#ff3f6c] bg-[#fff2f5]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-white text-slate-900">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-slate-900">{method.title}</p>
                        {selected ? (
                          <CheckCircle2 className="text-[#ff3f6c]" size={18} />
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {method.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {paymentMethod === "upi" ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_70%,#fff2f5_100%)] p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Enter your linked UPI ID
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Use the VPA connected to your bank account.
                </p>

                <label className="mt-4 mb-2 block text-sm font-medium text-slate-700">
                  UPI ID
                </label>
                <Input
                  value={upiId}
                  onChange={(event) => {
                    setUpiId(event.target.value.toLowerCase())
                    setUpiError("")
                  }}
                  placeholder="yourname@oksbi"
                  className={`h-12 rounded-2xl bg-white ${
                    upiError ? "border-[#ff3f6c]" : "border-slate-200"
                  }`}
                />
                {upiError ? (
                  <p className="mt-2 text-sm text-[#ff3f6c]">{upiError}</p>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    We validate UPI IDs in standard VPA format before placing the
                    order.
                  </p>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card className="rounded-[2rem] border-0 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
          <CardHeader className="p-6 pb-4 lg:p-8 lg:pb-4">
            <CardTitle className="text-xl font-black text-slate-950">
              Order summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0 lg:p-8 lg:pt-0">
            <div className="space-y-3">
              {orderSummary.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{item.title}</p>
                    <p className="text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <span className="whitespace-nowrap text-slate-700">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              {items.length > orderSummary.length ? (
                <p className="text-sm text-slate-500">
                  +{items.length - orderSummary.length} more item(s)
                </p>
              ) : null}
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment</span>
                <span>{selectedPayment?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? "FREE" : formatCurrency(delivery)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950">
                <span>Total payable</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {selectedAddress ? (
              <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Delivering to</p>
                <p className="mt-2 leading-6">
                  {selectedAddress.addressLine}, {selectedAddress.locality},{" "}
                  {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.pincode}
                </p>
              </div>
            ) : null}

            <Button
              type="button"
              disabled={
                !items.length ||
                isCheckingOut ||
                !selectedAddress ||
                (paymentMethod === "upi" && !hasValidUpi)
              }
              onClick={placeOrder}
              className="h-12 w-full rounded-full bg-slate-950 text-white hover:bg-slate-900"
            >
              {isCheckingOut
                ? paymentMethod === "stripe"
                  ? "Redirecting..."
                  : "Placing order..."
                : paymentMethod === "stripe"
                  ? "Continue to payment"
                  : "Place order"}
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
