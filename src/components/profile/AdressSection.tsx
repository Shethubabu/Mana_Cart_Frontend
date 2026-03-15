import { Package, MapPin, UserRound, PencilLine, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function AddressSection({
  stats,
  profile,
  addresses,
  setAddressForm,
  deleteAddress,
  openAddress,
  openProfile
}: any) {

  const icons: any = {
    Orders: Package,
    Addresses: MapPin,
    Profile: UserRound
  }

  return (
    <main className="space-y-6">

      

      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fff3f6_0%,#ffffff_55%,#fff8e8_100%)] p-6 lg:p-8">

        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
          Account overview
        </p>

        <h2 className="mt-3 text-3xl font-black text-slate-950">
          Manage your profile, addresses, and orders
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          {stats.map((item: any) => {
            const Icon = icons[item.label]

            return (
              <Card key={item.label} className="rounded-[1.5rem] border-0 bg-white">

                <CardContent className="flex items-center gap-4 p-5">

                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#ff3f6c]">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      {item.label}
                    </p>

                    <p className="text-sm font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>

                </CardContent>

              </Card>
            )
          })}

        </div>
      </section>


    

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

        <Card className="rounded-[2rem] border-0 bg-white/90">

          <CardHeader>
            <CardTitle className="text-xl font-black">
              Personal details
            </CardTitle>

            <CardDescription>
              Update the details used across your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="rounded-xl border p-4">
              <p className="text-xs text-slate-500">Full name</p>
              <p className="font-semibold">{profile.name}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-semibold">{profile.email}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="font-semibold">
                {profile.phone || "Add your phone number"}
              </p>
            </div>

            <Button
              onClick={openProfile}
              variant="outline"
              className="rounded-full"
            >
              <PencilLine className="size-4" />
              Edit profile
            </Button>

          </CardContent>
        </Card>


        {/* Address List */}

        <Card className="rounded-[2rem] border-0 bg-white/90">

          <CardHeader>
            <CardTitle className="text-xl font-black">
              Saved addresses
            </CardTitle>

            <CardDescription>
              Use these addresses during checkout
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {addresses.length ? (

              addresses.map((address: any) => (

                <div
                  key={address.id}
                  className="rounded-[1.5rem] border p-5 flex flex-col gap-4 md:flex-row md:justify-between"
                >

                  <div>

                    <div className="flex gap-3 items-center">

                      <p className="font-bold">{address.name}</p>

                      <span className="text-xs bg-[#fff1f4] text-[#ff3f6c] px-2 py-1 rounded-full">
                        {address.type}
                      </span>

                    </div>

                    <p className="text-sm text-slate-600 mt-2">
                      {address.addressLine}, {address.locality}, {address.city},{" "}
                      {address.state} - {address.pincode}
                    </p>

                    <p className="text-sm text-slate-500">
                      Phone: {address.phone}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAddressForm({
                          ...address,
                          landmark: address.landmark || ""
                        })
                        openAddress()
                      }}
                    >
                      <PencilLine className="size-4" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAddress(address.id)}
                      className="text-[#ff3f6c]"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>

                  </div>

                </div>

              ))

            ) : (

              <div className="rounded-xl border-dashed border p-6 text-center">

                <p className="font-semibold">
                  No address saved yet
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Add an address to make checkout faster
                </p>

              </div>

            )}

          </CardContent>

        </Card>

      </section>

    </main>
  )
}