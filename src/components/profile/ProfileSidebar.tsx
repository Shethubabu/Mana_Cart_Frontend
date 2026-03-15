import { LogOut, Plus, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfileSidebar({
  profile,
  logout,
  isLoggingOut,
  navigate,
  openProfile,
  openAddress
}: any) {

  return (
    <aside className="space-y-4">

      <Card className="rounded-[2rem] border-0 bg-slate-950 text-white">
        <CardContent className="space-y-5 px-6 py-7">

          <div className="inline-flex size-14 items-center justify-center rounded-full bg-white/12">
            <UserRound className="size-6" />
          </div>

          <div>
            <h1 className="text-3xl font-black">{profile.name}</h1>
            <p className="text-sm text-white/70">{profile.email}</p>
            {profile.phone && (
              <p className="text-sm text-white/70">{profile.phone}</p>
            )}
          </div>

          <Button
            className="w-full rounded-full bg-white text-slate-950"
            onClick={openProfile}
          >
            Edit profile
          </Button>

        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-0 bg-white/90">
        <CardContent className="space-y-2 px-6 py-6">

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={openAddress}
          >
            Add address
            <Plus />
          </Button>

          <Button
            variant="ghost"
            disabled={isLoggingOut}
            onClick={async () => {
              await logout()
              navigate("/")
            }}
            className="w-full justify-between text-[#ff3f6c]"
          >
            Logout
            <LogOut />
          </Button>

        </CardContent>
      </Card>

    </aside>
  )
}