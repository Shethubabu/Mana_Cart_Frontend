import type { ReactNode } from "react"
import axios from "axios"
import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, MapPin, Package, PencilLine, Plus, Trash2, UserRound } from "lucide-react"
import { useAddresses } from "@/hooks/useAddresses"
import { useSession } from "@/hooks/useSession"
import { useOrders } from "@/hooks/useOrders"
import { addressSchema, getFieldErrors, profileSchema } from "@/lib/validation"
import { pushToast } from "@/store/toastStore"
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

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-950">
          Sign in to access your profile
        </h1>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </div>
    )
  }

  return (
    <ProfileContent
      user={user}
      logout={logout}
      isLoggingOut={isLoggingOut}
      navigate={navigate}
    />
  )
}

function ProfileContent({
  user,
  logout,
  isLoggingOut,
  navigate
}: {
  user: { id: number; name: string; email: string }
  logout: () => Promise<void>
  isLoggingOut: boolean
  navigate: ReturnType<typeof useNavigate>
}) {
  const { orders } = useOrders()
  const {
    addresses,
    createAddress,
    isCreating,
    updateAddress,
    isUpdating,
    deleteAddress
  } = useAddresses()
  const [profile, setProfile] = useState<ProfileDetails>(() => {
    const storedProfile = window.localStorage.getItem(getProfileStorageKey(user.id))

    return storedProfile
      ? (JSON.parse(storedProfile) as ProfileDetails)
      : {
          name: user.name,
          email: user.email,
          phone: ""
        }
  })
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddress())
  const [profileError, setProfileError] = useState("")
  const [profileFieldErrors, setProfileFieldErrors] = useState<{
    name?: string
    email?: string
    phone?: string
  }>({})
  const [addressError, setAddressError] = useState("")
  const [addressFieldErrors, setAddressFieldErrors] = useState<{
    name?: string
    phone?: string
    pincode?: string
    locality?: string
    city?: string
    state?: string
    addressLine?: string
    landmark?: string
    type?: string
  }>({})

  const stats = useMemo(
    () => [
      {
        label: "Orders",
        value: orders.length,
        helper: orders[0]?.status || "No recent orders",
        icon: Package
      },
      {
        label: "Addresses",
        value: addresses.length,
        helper: "Saved for checkout",
        icon: MapPin
      },
      {
        label: "Profile",
        value: profile.phone ? "Ready" : "Incomplete",
        helper: profile.phone || "Add a phone number",
        icon: UserRound
      }
    ],
    [addresses.length, orders, profile.phone]
  )

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

  const updateProfileField = (field: keyof ProfileDetails, value: string) => {
    setProfile((current) => (current ? { ...current, [field]: value } : current))
    setProfileFieldErrors((current) => ({ ...current, [field]: undefined }))
    setProfileError("")
  }

  const updateAddressField = (
    field: Exclude<keyof AddressFormState, "id">,
    value: string
  ) => {
    setAddressForm((current) => ({
      ...current,
      [field]: value
    }))
    setAddressFieldErrors((current) => ({ ...current, [field]: undefined }))
    setAddressError("")
  }

  const saveProfile = () => {
    const result = profileSchema.safeParse(profile)

    if (!result.success) {
      setProfileFieldErrors(getFieldErrors<"name" | "email" | "phone">(result.error))
      setProfileError("Correct the highlighted profile fields before saving.")
      pushToast({
        tone: "info",
        title: "Profile details invalid",
        description: "Enter valid profile information before saving."
      })
      return
    }

    setProfileFieldErrors({})
    setProfileError("")
    setProfile(result.data)
    window.localStorage.setItem(
      getProfileStorageKey(user.id),
      JSON.stringify(result.data)
    )
    setProfileDialogOpen(false)
    pushToast({
      tone: "success",
      title: "Profile updated"
    })
  }

  const saveAddress = async (event?: { preventDefault: () => void }) => {
    event?.preventDefault()
    setAddressError("")
    const result = addressSchema.safeParse(addressPayload)

    if (!result.success) {
      setAddressFieldErrors(
        getFieldErrors<
          | "name"
          | "phone"
          | "pincode"
          | "locality"
          | "city"
          | "state"
          | "addressLine"
          | "landmark"
          | "type"
        >(result.error)
      )
      setAddressError("Correct the highlighted address fields before saving.")
      pushToast({
        tone: "info",
        title: "Address details invalid",
        description: "Complete the address with valid details before saving."
      })
      return
    }

    setAddressFieldErrors({})

    try {
      if (typeof addressForm.id === "number") {
        await updateAddress({
          id: addressForm.id,
          data: result.data
        })
      } else {
        await createAddress(result.data)
      }

      setAddressDialogOpen(false)
      setAddressForm(emptyAddress())
      pushToast({
        tone: "success",
        title: addressForm.id ? "Address updated" : "Address added"
      })
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
        : "Address could not be saved. Check the form and try again."

      setAddressError(message)
      pushToast({
        tone: "error",
        title: "Could not save address",
        description: message
      })
    }
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteAddress(id)
      pushToast({
        tone: "success",
        title: "Address removed"
      })
    } catch {
      pushToast({
        tone: "error",
        title: "Could not remove address",
        description: "Please try again."
      })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <Card className="rounded-[2rem] border-0 bg-slate-950 py-0 text-white">
            <CardContent className="space-y-5 px-6 py-7">
              <div className="inline-flex size-14 items-center justify-center rounded-full bg-white/12">
                <UserRound className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                  Account
                </p>
                <h1 className="mt-2 text-3xl font-black leading-tight">{profile.name}</h1>
                <p className="mt-3 text-sm text-white/70">{profile.email}</p>
                {profile.phone ? (
                  <p className="mt-1 text-sm text-white/70">{profile.phone}</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-11 w-full rounded-full bg-white text-slate-950 hover:bg-white/90"
                onClick={() => {
                  setProfileError("")
                  setProfileFieldErrors({})
                  setProfileDialogOpen(true)
                }}
              >
                <PencilLine className="size-4" />
                Edit profile
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 bg-white/90 py-0 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <CardContent className="space-y-2 px-6 py-6">
              <Button asChild variant="ghost" className="h-12 w-full justify-between rounded-2xl">
                <Link to="/orders">
                  Orders
                  <Package className="size-4" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-12 w-full justify-between rounded-2xl"
                onClick={() => {
                  setAddressError("")
                  setAddressFieldErrors({})
                  setAddressForm(emptyAddress())
                  setAddressDialogOpen(true)
                }}
              >
                Add address
                <Plus className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={isLoggingOut}
                onClick={async () => {
                  await logout()
                  pushToast({
                    tone: "success",
                    title: "Logged out successfully"
                  })
                  navigate("/")
                }}
                className="h-12 w-full justify-between rounded-2xl text-[#ff3f6c] hover:bg-[#fff2f5] hover:text-[#ff3f6c]"
              >
                {isLoggingOut ? "Signing out..." : "Logout"}
                <LogOut className="size-4" />
              </Button>
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
                <h2 className="text-3xl font-black text-slate-950">
                  Manage your profile, addresses, and orders
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Keep checkout faster by maintaining your delivery details and
                  account information in one place.
                </p>
              </div>
              <Button asChild className="h-11 rounded-full bg-[#ff3f6c] px-6 text-white hover:bg-[#e73561]">
                <Link to="/orders">View orders</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {stats.map((item) => {
                const Icon = item.icon

                return (
                  <Card
                    key={item.label}
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
              })}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[2rem] border-0 bg-white/90 py-0 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl font-black text-slate-950">
                  Personal details
                </CardTitle>
                <CardDescription>
                  Update only the details used across your account and checkout.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 px-6 pb-6">
                {[
                  ["Full name", profile.name],
                  ["Email", profile.email],
                  ["Mobile", profile.phone || "Add your phone number"]
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
                  className="h-11 rounded-full border-slate-300"
                  onClick={() => {
                    setProfileError("")
                    setProfileFieldErrors({})
                    setProfileDialogOpen(true)
                  }}
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
                    <CardTitle className="text-xl font-black text-slate-950">
                      Saved addresses
                    </CardTitle>
                    <CardDescription>
                      Use these addresses during checkout.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    className="h-10 rounded-full bg-[#ff3f6c] px-4 text-white hover:bg-[#e73561]"
                    onClick={() => {
                      setAddressError("")
                      setAddressFieldErrors({})
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
                              setAddressFieldErrors({})
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
                            onClick={() => void handleDeleteAddress(address.id)}
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

      <Dialog
        open={profileDialogOpen}
        onOpenChange={(open) => {
          setProfileDialogOpen(open)

          if (!open) {
            setProfileError("")
            setProfileFieldErrors({})
          }
        }}
      >
        <DialogContent className="max-w-xl rounded-[1.75rem] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-black text-slate-950">
              Edit profile
            </DialogTitle>
            <DialogDescription>
              Update the account details shown across ManaCart.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
            <Field label="Full name">
              <Input
                value={profile.name}
                className={profileFieldErrors.name ? "border-[#ff3f6c]" : undefined}
                onChange={(event) => updateProfileField("name", event.target.value)}
              />
              {profileFieldErrors.name ? (
                <FieldError message={profileFieldErrors.name} />
              ) : null}
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={profile.email}
                className={profileFieldErrors.email ? "border-[#ff3f6c]" : undefined}
                onChange={(event) => updateProfileField("email", event.target.value)}
              />
              {profileFieldErrors.email ? (
                <FieldError message={profileFieldErrors.email} />
              ) : null}
            </Field>
            <Field label="Mobile" className="md:col-span-2">
              <Input
                value={profile.phone}
                maxLength={10}
                className={profileFieldErrors.phone ? "border-[#ff3f6c]" : undefined}
                onChange={(event) =>
                  updateProfileField(
                    "phone",
                    event.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
              />
              {profileFieldErrors.phone ? (
                <FieldError message={profileFieldErrors.phone} />
              ) : null}
            </Field>
          </div>
          {profileError ? (
            <p className="px-6 pb-2 text-sm font-medium text-[#ff3f6c]">{profileError}</p>
          ) : null}
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
            setAddressFieldErrors({})
            setAddressForm(emptyAddress())
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-[1.75rem] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-black text-slate-950">
              {addressForm.id ? "Edit address" : "Add new address"}
            </DialogTitle>
            <DialogDescription>
              Save delivery information for faster checkout.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveAddress}>
            <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
              <Field label="Full name">
                <Input
                  value={addressForm.name}
                  className={addressFieldErrors.name ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) => updateAddressField("name", event.target.value)}
                />
                {addressFieldErrors.name ? (
                  <FieldError message={addressFieldErrors.name} />
                ) : null}
              </Field>
              <Field label="Mobile">
                <Input
                  value={addressForm.phone}
                  maxLength={10}
                  className={addressFieldErrors.phone ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) =>
                    updateAddressField(
                      "phone",
                      event.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                />
                {addressFieldErrors.phone ? (
                  <FieldError message={addressFieldErrors.phone} />
                ) : null}
              </Field>
              <Field label="Pincode">
                <Input
                  value={addressForm.pincode}
                  maxLength={6}
                  className={addressFieldErrors.pincode ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) =>
                    updateAddressField(
                      "pincode",
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                />
                {addressFieldErrors.pincode ? (
                  <FieldError message={addressFieldErrors.pincode} />
                ) : null}
              </Field>
              <Field label="Locality">
                <Input
                  value={addressForm.locality}
                  className={addressFieldErrors.locality ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) =>
                    updateAddressField("locality", event.target.value)
                  }
                />
                {addressFieldErrors.locality ? (
                  <FieldError message={addressFieldErrors.locality} />
                ) : null}
              </Field>
              <Field label="City">
                <Input
                  value={addressForm.city}
                  className={addressFieldErrors.city ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) => updateAddressField("city", event.target.value)}
                />
                {addressFieldErrors.city ? (
                  <FieldError message={addressFieldErrors.city} />
                ) : null}
              </Field>
              <Field label="State">
                <Input
                  value={addressForm.state}
                  className={addressFieldErrors.state ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) => updateAddressField("state", event.target.value)}
                />
                {addressFieldErrors.state ? (
                  <FieldError message={addressFieldErrors.state} />
                ) : null}
              </Field>
              <Field label="Address" className="md:col-span-2">
                <Input
                  value={addressForm.addressLine}
                  className={addressFieldErrors.addressLine ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) =>
                    updateAddressField("addressLine", event.target.value)
                  }
                />
                {addressFieldErrors.addressLine ? (
                  <FieldError message={addressFieldErrors.addressLine} />
                ) : null}
              </Field>
              <Field label="Landmark">
                <Input
                  value={addressForm.landmark}
                  className={addressFieldErrors.landmark ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) =>
                    updateAddressField("landmark", event.target.value)
                  }
                />
                {addressFieldErrors.landmark ? (
                  <FieldError message={addressFieldErrors.landmark} />
                ) : null}
              </Field>
              <Field label="Address type">
                <Input
                  value={addressForm.type}
                  className={addressFieldErrors.type ? "border-[#ff3f6c]" : undefined}
                  onChange={(event) => updateAddressField("type", event.target.value)}
                />
                {addressFieldErrors.type ? (
                  <FieldError message={addressFieldErrors.type} />
                ) : null}
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

function FieldError({ message }: { message: string }) {
  return <p className="mt-2 text-sm text-[#ff3f6c]">{message}</p>
}
