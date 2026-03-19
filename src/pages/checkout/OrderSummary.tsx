import { useMemo } from "react"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { loadRazorpaySdk } from "@/lib/razorpay"
import { pushToast } from "@/store/toastStore"

interface Address {
  id: number
  name: string
  phone: string
  pincode: string
  locality: string
  city: string
  state: string
  addressLine: string
  landmark?: string
  type: string
}

interface CartItem {
  id: number
  quantity: number
  productId?: number
  product: {
    id?: number
    title: string
    price: number
  }
}

interface Props {
  items: CartItem[]
  addresses: Address[]
  selectedAddressId: number | null
  paymentMethod: "cod" | "upi" | "razorpay"
  upiId: string
  checkout: (payload: {
    addressId: number
    paymentMethod: "cod" | "upi" | "razorpay"
    upiId?: string
  }) => Promise<{
    key?: string
    keyId?: string
    razorpayKey?: string
    razorpayKeyId?: string
    orderId?: string
    order_id?: string
    razorpayOrderId?: string
    amount?: number
    currency?: string
    name?: string
    description?: string
    image?: string
    prefill?: {
      name?: string
      email?: string
      contact?: string
    }
    notes?: Record<string, string>
    order?: {
      id?: string
      amount?: number
      currency?: string
    }
  }>
  confirmPayment: (payload: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }) => Promise<unknown>
  isCheckingOut: boolean
}

export default function OrderSummary({
  items,
  addresses,
  selectedAddressId,
  paymentMethod,
  upiId,
  checkout,
  confirmPayment,
  isCheckingOut
}: Props) {
  const navigate = useNavigate()

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const delivery = 0
  const total = subtotal

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
        title: "Select a delivery address"
      })
      return
    }

    try {
      const response = await checkout({
        addressId: selectedAddress.id,
        paymentMethod,
        upiId: paymentMethod === "upi" ? upiId : undefined
      })

      if (paymentMethod === "razorpay") {
        await loadRazorpaySdk()

        if (!window.Razorpay) {
          throw new Error("Razorpay SDK not loaded")
        }

        const razorpayKey =
          response.key ||
          response.keyId ||
          response.razorpayKey ||
          response.razorpayKeyId ||
          import.meta.env.VITE_RAZORPAY_KEY_ID

        if (!razorpayKey) {
          throw new Error(
            "Razorpay key is missing. Set VITE_RAZORPAY_KEY_ID in your .env file"
          )
        }

        const razorpayOrderId =
          response.orderId ||
          response.order_id ||
          response.razorpayOrderId ||
          response.order?.id

        if (!razorpayOrderId) {
          throw new Error("Razorpay order was not created")
        }

        const razorpay = new window.Razorpay({
          key: razorpayKey,
          order_id: razorpayOrderId,
          amount: response.amount || response.order?.amount || total * 100,
          currency: response.currency || response.order?.currency || "INR",
          name: response.name || "ManaCart",
          description: response.description || "Complete your order payment",
          image: response.image,
          prefill: response.prefill,
          notes: response.notes,
          theme: {
            color: "#ff3f6c"
          },
          handler: async (paymentResult: {
            razorpay_order_id: string
            razorpay_payment_id: string
            razorpay_signature: string
          }) => {
            await confirmPayment({
              razorpayOrderId: paymentResult.razorpay_order_id,
              razorpayPaymentId: paymentResult.razorpay_payment_id,
              razorpaySignature: paymentResult.razorpay_signature
            })

            navigate("/orders?payment=success")
          },
          modal: {
            ondismiss: () => {
              pushToast({
                tone: "info",
                title: "Payment not completed"
              })
            }
          }
        })

        razorpay.open()
        return
      }

      pushToast({
        tone: "success",
        title: "Order placed successfully"
      })

      navigate("/orders")
    } catch (error) {
      const checkoutError = error as AxiosError<{ message?: string }>
      const status = checkoutError.response?.status
      const description =
        checkoutError.response?.data?.message ||
        (status === 401
          ? "Your session expired. Please sign in again and retry."
          : status === 502
            ? "The checkout service is temporarily unavailable. Please try again in a moment."
            : "Please try again.")

      pushToast({
        tone: "error",
        title: "Checkout failed",
        description
      })
    }
  }

  return (
    <aside className="space-y-6">

      <Card className="rounded-[2rem] border-0 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]">

        <CardHeader className="p-6 pb-4 lg:p-8 lg:pb-4">
          <CardTitle className="text-xl font-black text-slate-950">
            Order summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 p-6 pt-0 lg:p-8 lg:pt-0">

          {/* ITEMS */}

          <div className="space-y-3">

            {orderSummary.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-slate-500">
                    Qty {item.quantity}
                  </p>
                </div>

                <span className="whitespace-nowrap text-slate-700">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}

          </div>

          {/* TOTALS */}

          <div className="space-y-4 border-t border-slate-200 pt-4 text-sm text-slate-600">

            <div className="flex justify-between">
              <span>Items</span>
              <span>{itemCount}</span>
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

          {/* ADDRESS */}

          {selectedAddress && (
            <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">

              <p className="font-semibold text-slate-900">
                Delivering to
              </p>

              <p className="mt-2 leading-6">
                {selectedAddress.addressLine},{" "}
                {selectedAddress.locality},{" "}
                {selectedAddress.city},{" "}
                {selectedAddress.state} -{" "}
                {selectedAddress.pincode}
              </p>

            </div>
          )}

          {/* BUTTON */}

          <Button
            type="button"
            disabled={!items.length || !selectedAddress || isCheckingOut}
            onClick={placeOrder}
            className="h-12 w-full rounded-full bg-slate-950 text-white hover:bg-slate-900"
          >
            {isCheckingOut ? "Processing..." : "Place order"}
          </Button>

        </CardContent>

      </Card>

    </aside>
  )
}
