import axios from "axios"
import { addressSchema, profileSchema, getFieldErrors } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function ProfileDialogs({
  profile,
  setProfile,
  profileDialogOpen,
  setProfileDialogOpen,
  addressDialogOpen,
  setAddressDialogOpen,
  addressForm,
  setAddressForm,
  createAddress,
  updateAddress,
  isSavingAddress
}: any) {

  const emptyAddress = {
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    city: "",
    state: "",
    addressLine: "",
    landmark: "",
    type: "Home"
  }

  

  const saveProfile = () => {

    const result = profileSchema.safeParse(profile)

    if (!result.success) {
      console.log(getFieldErrors(result.error))
      return
    }

    setProfile(result.data)
    setProfileDialogOpen(false)
  }



  const saveAddress = async (e: React.FormEvent) => {

    e.preventDefault()

    const payload = {
      name: addressForm.name.trim(),
      phone: addressForm.phone.trim(),
      pincode: addressForm.pincode.trim(),
      locality: addressForm.locality.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      addressLine: addressForm.addressLine.trim(),
      landmark: addressForm.landmark?.trim() || "",
      type: addressForm.type.trim()
    }

    const result = addressSchema.safeParse(payload)

    if (!result.success) {
      console.log(getFieldErrors(result.error))
      return
    }

    try {

      if (addressForm.id) {

        await updateAddress({
          id: addressForm.id,
          data: result.data
        })

      } else {

        await createAddress(result.data)

      }

      setAddressDialogOpen(false)
      setAddressForm(emptyAddress)

    } catch (error) {

      if (axios.isAxiosError(error)) {
        console.error(error.response?.data)
      }

    }
  }

  return (
    <>
     

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>

        <DialogContent className="max-w-xl">

          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">

            <Input
              value={profile.name}
              placeholder="Full name"
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <Input
              value={profile.email}
              placeholder="Email"
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <Input
              value={profile.phone}
              placeholder="Phone"
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

          </div>

          <DialogFooter>

            <Button onClick={saveProfile}>
              Save changes
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>


      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>

        <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">

          <DialogHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <DialogTitle>
              {addressForm.id ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={saveAddress}
            className="grid gap-4 overflow-y-auto px-4 pb-4 md:grid-cols-2 md:px-6 md:pb-6"
          >

           

            <Input
              placeholder="Full name"
              value={addressForm.name}
              onChange={(e) =>
                setAddressForm({ ...addressForm, name: e.target.value })
              }
            />


            <Input
              placeholder="Phone"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10)
                })
              }
            />

          

            <Input
              placeholder="Pincode"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  pincode: e.target.value.replace(/\D/g, "").slice(0, 6)
                })
              }
            />

           

            <Input
              placeholder="Locality"
              value={addressForm.locality}
              onChange={(e) =>
                setAddressForm({ ...addressForm, locality: e.target.value })
              }
            />

            

            <Input
              placeholder="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
            />

         

            <Input
              placeholder="State"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
            />

           

            <Input
              className="md:col-span-2"
              placeholder="House No, Building, Street"
              value={addressForm.addressLine}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  addressLine: e.target.value
                })
              }
            />

           

            <Input
              placeholder="Landmark"
              value={addressForm.landmark}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  landmark: e.target.value
                })
              }
            />

          

            <Input
              placeholder="Type (Home / Work)"
              value={addressForm.type}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  type: e.target.value
                })
              }
            />

            <div className="col-span-1 border-t border-slate-200 pt-4 md:col-span-2">
              <Button
                type="submit"
                disabled={isSavingAddress}
                className="w-full sm:w-auto"
              >
                {isSavingAddress ? "Saving..." : "Save address"}
              </Button>
            </div>

          </form>

        </DialogContent>

      </Dialog>
    </>
  )
}
