import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
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
  product: {
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
  checkout: any
  isCheckingOut: boolean
}

export default function OrderSummary({
  items,
  addresses,
  selectedAddressId,
  paymentMethod,
  upiId,
  checkout,
  isCheckingOut
}: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const delivery = subtotal > 100 ? 0 : 1
  const total = subtotal + delivery

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

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

  if (!razorpayKey) {
    throw new Error(
      "Razorpay key is missing. Set VITE_RAZORPAY_KEY_ID in your .env file"
    )
  }

  const razorpay = new window.Razorpay({
    key: razorpayKey,
    order_id: response.orderId,
    amount: response.amount,
    currency: response.currency || "INR",
    name: "ManaCart",
    description: "Complete your order payment",
    theme: {
      color: "#ff3f6c"
    },
    handler: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] })
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
      navigate("/orders?payment=success")
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
      pushToast({
        tone: "error",
        title: "Checkout failed"
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