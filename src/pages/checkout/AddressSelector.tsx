import { CheckCircle2, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

interface Props {
  addresses: Address[]
  isLoading: boolean
  selectedAddressId: number | null
  setSelectedAddressId: (id: number) => void
}

export default function AddressSelector({
  addresses,
  isLoading,
  selectedAddressId,
  setSelectedAddressId
}: Props) {
  return (
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

        {isLoading ? (
          <p className="text-sm text-slate-500">
            Loading saved addresses...
          </p>
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
                      {address.landmark
                        ? ` | Landmark: ${address.landmark}`
                        : ""}
                    </p>

                  </div>

                  {active && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#ff3f6c]">
                      <CheckCircle2 size={16} />
                      Selected
                    </div>
                  )}

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
  )
}