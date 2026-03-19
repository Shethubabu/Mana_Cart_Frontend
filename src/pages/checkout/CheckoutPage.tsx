import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "@/hooks/useCart"
import { useOrders } from "@/hooks/useOrders"
import { useAddresses } from "@/hooks/useAddresses"
import { useSession } from "@/hooks/useSession"

import AddressSelector from "./AddressSelector"
import PaymentMethods from "./PaymentMethods"
import OrderSummary from "./OrderSummary"

export default function CheckoutPage() {
  const { user, isLoadingUser } = useSession()
  const { items } = useCart()
  const { addresses, isLoading } = useAddresses()
  const { checkout, isCheckingOut, confirmPayment, isConfirmingPayment } = useOrders()

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "razorpay">(
    "cod"
  )

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [upiId, setUpiId] = useState("")

  if (isLoadingUser && !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-slate-500">
        Checking your session...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-950">Login to continue checkout</h1>
        <p className="mt-3 text-sm text-slate-600">
          Sign in to use your saved addresses and place orders.
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

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-6">
      
      <section className="space-y-6">

        <AddressSelector
          addresses={addresses}
          isLoading={isLoading}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
        />

        <PaymentMethods
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          upiId={upiId}
          setUpiId={setUpiId}
        />

      </section>

      <OrderSummary
        items={items}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        paymentMethod={paymentMethod}
        upiId={upiId}
        checkout={checkout}
        confirmPayment={confirmPayment}
        isCheckingOut={isCheckingOut || isConfirmingPayment}
      />

    </div>
  )
}
