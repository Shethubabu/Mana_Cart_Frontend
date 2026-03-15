import { useMemo, useState } from "react"
import { useOrders } from "@/hooks/useOrders"
import { useAddresses } from "@/hooks/useAddresses"
import ProfileSidebar from "./ProfileSidebar"
import AddressSection from "./AdressSection"
import ProfileDialogs from "./ProfileDialogs"

/* ---------- TYPES ---------- */

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

/* ---------- EMPTY ADDRESS ---------- */

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

export default function ProfileContent({
  user,
  logout,
  isLoggingOut,
  navigate
}: any) {

  const { orders } = useOrders()

  const {
    addresses,
    createAddress,
    updateAddress,
    deleteAddress,
    isCreating,
    isUpdating
  } = useAddresses()

  /* ---------- STATE ---------- */

  const [profile, setProfile] = useState<ProfileDetails>({
    name: user.name,
    email: user.email,
    phone: ""
  })

  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)

  const [addressForm, setAddressForm] = useState<AddressFormState>(
    emptyAddress()
  )

  /* ---------- STATS ---------- */

  const stats = useMemo(
    () => [
      { label: "Orders", value: orders.length },
      { label: "Addresses", value: addresses.length },
      { label: "Profile", value: profile.phone ? "Ready" : "Incomplete" }
    ],
    [orders.length, addresses.length, profile.phone]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

        <ProfileSidebar
          profile={profile}
          logout={logout}
          isLoggingOut={isLoggingOut}
          navigate={navigate}
          openProfile={() => setProfileDialogOpen(true)}
          openAddress={() => {
            setAddressForm(emptyAddress())
            setAddressDialogOpen(true)
          }}
        />

        <AddressSection
          stats={stats}
          profile={profile}
          addresses={addresses}
          setAddressForm={setAddressForm}
          deleteAddress={deleteAddress}
          openAddress={() => setAddressDialogOpen(true)}
          openProfile={() => setProfileDialogOpen(true)}
        />

      </div>

      <ProfileDialogs
        profile={profile}
        setProfile={setProfile}
        profileDialogOpen={profileDialogOpen}
        setProfileDialogOpen={setProfileDialogOpen}
        addressDialogOpen={addressDialogOpen}
        setAddressDialogOpen={setAddressDialogOpen}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        createAddress={createAddress}
        updateAddress={updateAddress}
        isSavingAddress={isCreating || isUpdating}
      />

    </div>
  )
}