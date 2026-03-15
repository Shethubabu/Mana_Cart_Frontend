import { CreditCard, Smartphone, Truck, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    id: "razorpay",
    title: "Cards and online payment",
    description: "Pay securely using Razorpay checkout.",
    icon: CreditCard
  }
] as const

interface Props {
  paymentMethod: "cod" | "upi" | "razorpay"
  setPaymentMethod: (method: "cod" | "upi" | "razorpay") => void
  upiId: string
  setUpiId: (value: string) => void
}

export default function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  upiId,
  setUpiId
}: Props) {
  return (
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
                onClick={() => setPaymentMethod(method.id)}
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
                    <p className="font-semibold text-slate-900">
                      {method.title}
                    </p>

                    {selected && (
                      <CheckCircle2
                        className="text-[#ff3f6c]"
                        size={18}
                      />
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    {method.description}
                  </p>

                </div>

              </button>
            )
          })}

        </div>

        {/* UPI INPUT */}

        {paymentMethod === "upi" && (
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
              onChange={(e) => setUpiId(e.target.value.toLowerCase())}
              placeholder="yourname@oksbi"
              className="h-12 rounded-2xl bg-white border-slate-200"
            />

            <p className="mt-2 text-xs text-slate-500">
              Enter a valid UPI ID such as yourname@oksbi
            </p>

          </div>
        )}

      </CardContent>

    </Card>
  )
}