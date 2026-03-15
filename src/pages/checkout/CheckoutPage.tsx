import { useState } from "react"
import { useCart } from "@/hooks/useCart"
import { useOrders } from "@/hooks/useOrders"
import { useAddresses } from "@/hooks/useAddresses"

import AddressSelector from "./AddressSelector"
import PaymentMethods from "./PaymentMethods"
import OrderSummary from "./OrderSummary"

export default function CheckoutPage() {
  const { items } = useCart()
  const { addresses, isLoading } = useAddresses()
  const { checkout, isCheckingOut } = useOrders()

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "razorpay">(
    "cod"
  )

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [upiId, setUpiId] = useState("")

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
        isCheckingOut={isCheckingOut}
      />

    </div>
  )
}