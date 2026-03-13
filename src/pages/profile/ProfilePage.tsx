import type { ReactNode } from "react"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { useAddresses } from "@/hooks/useAddresses"
import {
  LogOut,
  MapPin,
  Package,
  PencilLine,
  Plus,
  Trash2,
  UserRound
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@/hooks/useSession"
import { useOrders } from "@/hooks/useOrders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface ProfileDetails {
  name: string
  email: string
  phone: string
  gender: string
}

interface AddressFormState {
  id?: number
  name: string
  phone: string
  pincode: string
  locality: string
  city: string
  state: string
  addressLine: string
  landmark: string
  type: string
}

const emptyAddress = (): AddressFormState => ({
  name: "",
  phone: "",
  pincode: "",
  locality: "",
  city: "",
  state: "",
  addressLine: "",
  landmark: "",
  type: "Home"
})

const getProfileStorageKey = (userId: number) => `manacart-profile-${userId}`


export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isLoggingOut } = useSession()
  const { orders } = useOrders()
  const [profile, setProfile] = useState<ProfileDetails | null>(null)
  const {
    addresses,
    createAddress,
    isCreating,
    updateAddress,
    isUpdating,
    deleteAddress
  } = useAddresses()
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddress())
  const [addressError, setAddressError] = useState("")
  const orderCount = orders.length
  const latestOrderStatus = orders[0]?.status || "View order history"

  useEffect(() => {
    if (!user) {
      return
    }

    const storedProfile = window.localStorage.getItem(getProfileStorageKey(user.id))
    

    setProfile(
      storedProfile
        ? (JSON.parse(storedProfile) as ProfileDetails)
        : {
            name: user.name,
            email: user.email,
            phone: "",
            gender: "Not set"
          }
    )
    
  }, [user])

  const stats = useMemo(
    () => [
      {
        label: "Orders",
        value: `${orderCount.toString().padStart(2, "0")} placed`,
        helper: latestOrderStatus,
        icon: Package,
        to: "/orders"
      },
      {
        label: "Addresses",
        value: `${addresses.length.toString().padStart(2, "0")} saved`,
        helper: "Manage delivery locations",
        icon: MapPin
      },
      {
        label: "Profile",
        value: profile?.phone ? "Details updated" : "Complete your details",
        helper: profile?.phone || "Add mobile number",
        icon: UserRound
      }
    ],
    [addresses.length, latestOrderStatus, orderCount, profile?.phone]
  )

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black uppercase text-slate-950">
          Sign in to access your profile
        </h1>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
        >
          Login
        </Link>
      </div>
    )
  }

  if (!profile) {
    return <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">Loading...</div>
  }

  const saveProfile = () => {
    window.localStorage.setItem(
      getProfileStorageKey(user.id),
      JSON.stringify(profile)
    )
    setProfileDialogOpen(false)
  }

  const addressPayload = {
    name: addressForm.name.trim(),
    phone: addressForm.phone.trim(),
    pincode: addressForm.pincode.trim(),
    locality: addressForm.locality.trim(),
    city: addressForm.city.trim(),
    state: addressForm.state.trim(),
    addressLine: addressForm.addressLine.trim(),
    landmark: addressForm.landmark.trim(),
    type: addressForm.type.trim()
  }

  const isSavingAddress = isCreating || isUpdating

  const saveAddress = async (event?: { preventDefault: () => void }) => {
    event?.preventDefault()
    setAddressError("")

    if (
      !addressPayload.name ||
      !addressPayload.phone ||
      !addressPayload.pincode ||
      !addressPayload.locality ||
      !addressPayload.city ||
      !addressPayload.state ||
      !addressPayload.addressLine ||
      !addressPayload.type
    ) {
      setAddressError("Fill in all required address fields before saving.")
      return
    }

    try {
      if (typeof addressForm.id === "number") {
        await updateAddress({
          id: addressForm.id,
          data: addressPayload
        })
      } else {
        await createAddress(addressPayload)
      }

      setAddressDialogOpen(false)
      setAddressForm(emptyAddress())
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
        : "Address could not be saved. Check the form and try again."

      setAddressError(message)
    }
  }

  const handleDeleteAddress = async (id: number) => {
  await deleteAddress(id)
}

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <Card className="rounded-[2rem] border-0 bg-slate-950 py-0 text-white ring-0">
            <CardContent className="space-y-5 px-6 py-7">
              <div className="inline-flex size-14 items-center justify-center rounded-full bg-white/12">
                <UserRound className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                  Account
                </p>
                <h1 className="mt-2 text-3xl font-black uppercase leading-tight">
                  {profile.name}
                </h1>
                <p className="mt-3 text-sm text-white/70">{profile.email}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-11 w-full rounded-full bg-white text-slate-950 hover:bg-white/90"
                onClick={() => setProfileDialogOpen(true)}
              >
                <PencilLine className="size-4" />
                Edit profile
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 bg-white/90 py-0 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <CardContent className="space-y-2 px-6 py-6">
              <Link
                to="/orders"
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span>Orders</span>
                <Package className="size-4" />
              </Link>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setAddressError("")
                  setAddressForm(emptyAddress())
                  setAddressDialogOpen(true)
                }}
              >
                <span>Add address</span>
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={async () => {
                  await logout()
                  navigate("/")
                }}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#ff3f6c] hover:bg-[#fff2f5]"
              >
                <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
                <LogOut className="size-4" />
              </button>
            </CardContent>
          </Card>
        </aside>

        <main className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fff3f6_0%,#ffffff_55%,#fff8e8_100%)] p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
              Account overview
            </p>
            <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase text-slate-950">
                  Manage your profile, addresses and orders
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Keep delivery details ready, update profile information, and
                  move through checkout faster.
                </p>
              </div>
              <Button
                asChild
                className="h-11 rounded-full bg-[#ff3f6c] px-6 text-white hover:bg-[#e73561]"
              >
                <Link to="/orders">View orders</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {stats.map((item) => {
                const Icon = item.icon
                const cardContent = (
                  <Card
                    className="rounded-[1.5rem] border-0 bg-white/85 py-0 shadow-none ring-1 ring-slate-200/80"
                  >
                    <CardContent className="flex items-center gap-4 px-5 py-5">
                      <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#ff3f6c]">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
                      </div>
                    </CardContent>
                  </Card>
                )

                if (item.to) {
                  return (
                    <Link key={item.label} to={item.to} className="block">
                      {cardContent}
                    </Link>
                  )
                }

                return <div key={item.label}>{cardContent}</div>
              })}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[2rem] border-0 bg-white/90 py-0 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl font-black uppercase text-slate-950">
                  Personal details
                </CardTitle>
                <CardDescription>
                  Keep this information updated for faster support and checkout.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 px-6 pb-6 md:grid-cols-2">
                {[
                  ["Full name", profile.name],
                  ["Email", profile.email],
                  ["Mobile", profile.phone || "Add your phone number"],
                  ["Gender", profile.gender]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-full border-slate-300 md:col-span-2"
                  onClick={() => setProfileDialogOpen(true)}
                >
                  <PencilLine className="size-4" />
                  Edit profile
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 bg-white/90 py-0 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
              <CardHeader className="px-6 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-black uppercase text-slate-950">
                      Saved addresses
                    </CardTitle>
                    <CardDescription>
                      Add home and work delivery locations here.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    className="h-10 rounded-full bg-[#ff3f6c] px-4 text-white hover:bg-[#e73561]"
                    onClick={() => {
                      setAddressError("")
                      setAddressForm(emptyAddress())
                      setAddressDialogOpen(true)
                    }}
                  >
                    <Plus className="size-4" />
                    Add address
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                {addresses.length ? (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-[1.5rem] border border-slate-200 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-base font-bold text-slate-950">
                              {address.name}
                            </p>
                            <span className="rounded-full bg-[#fff1f4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff3f6c]">
                              {address.type}
                            </span>
                          </div>
                          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                            {address.addressLine}, {address.locality}, {address.city},{" "}
                            {address.state} - {address.pincode}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">
                            Phone: {address.phone}
                            {address.landmark ? ` | Landmark: ${address.landmark}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => {
                              setAddressError("")
                              setAddressForm({
                                ...address,
                                landmark: address.landmark || ""
                            })
                              setAddressDialogOpen(true)
                            }}
                          >
                            <PencilLine className="size-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-[#ff3f6c] hover:bg-[#fff2f5] hover:text-[#ff3f6c]"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      No address saved yet.
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Add an address to make checkout faster.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-xl rounded-[1.75rem] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-black uppercase text-slate-950">
              Edit profile
            </DialogTitle>
            <DialogDescription>
              Update the details shown across your account area.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
            <Field label="Full name">
              <Input
                value={profile.name}
                onChange={(event) =>
                  setProfile((current) =>
                    current ? { ...current, name: event.target.value } : current
                  )
                }
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={profile.email}
                onChange={(event) =>
                  setProfile((current) =>
                    current ? { ...current, email: event.target.value } : current
                  )
                }
              />
            </Field>
            <Field label="Mobile">
              <Input
                value={profile.phone}
                onChange={(event) =>
                  setProfile((current) =>
                    current ? { ...current, phone: event.target.value } : current
                  )
                }
              />
            </Field>
            <Field label="Gender">
              <Input
                value={profile.gender}
                onChange={(event) =>
                  setProfile((current) =>
                    current ? { ...current, gender: event.target.value } : current
                  )
                }
              />
            </Field>
          </div>
          <DialogFooter className="rounded-b-[1.75rem]" showCloseButton>
            <Button
              type="button"
              className="rounded-full bg-[#ff3f6c] px-5 text-white hover:bg-[#e73561]"
              onClick={saveProfile}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addressDialogOpen}
        onOpenChange={(open) => {
          setAddressDialogOpen(open)

          if (!open) {
            setAddressError("")
            setAddressForm(emptyAddress())
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-[1.75rem] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-black uppercase text-slate-950">
              {addressForm.id ? "Edit address" : "Add new address"}
            </DialogTitle>
            <DialogDescription>
              Save delivery information for a faster checkout flow.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveAddress}>
            <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
            <Field label="Full name">
              <Input
                value={addressForm.name}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="Mobile">
              <Input
                value={addressForm.phone}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    phone: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="Pincode">
              <Input
                value={addressForm.pincode}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    pincode: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="Locality">
              <Input
                value={addressForm.locality}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    locality: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="City">
              <Input
                value={addressForm.city}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    city: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="State">
              <Input
                value={addressForm.state}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    state: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="Address" className="md:col-span-2">
              <Input
                value={addressForm.addressLine}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    addressLine: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="Landmark">
              <Input
                value={addressForm.landmark}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    landmark: event.target.value
                  }))
                }
              />
            </Field>
            <Field label="Address type">
              <Input
                value={addressForm.type}
                onChange={(event) =>
                  setAddressForm((current) => ({
                    ...current,
                    type: event.target.value
                  }))
                }
              />
            </Field>
            </div>
            {addressError ? (
              <p className="px-6 pb-4 text-sm font-medium text-[#ff3f6c]">
                {addressError}
              </p>
            ) : null}
            <DialogFooter className="rounded-b-[1.75rem]" showCloseButton>
              <Button
                type="submit"
                disabled={isSavingAddress}
                className="rounded-full bg-[#ff3f6c] px-5 text-white hover:bg-[#e73561] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingAddress
                  ? "Saving..."
                  : addressForm.id
                    ? "Update address"
                    : "Save address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({
  label,
  className,
  children
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}
