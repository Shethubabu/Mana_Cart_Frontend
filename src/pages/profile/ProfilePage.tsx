import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@/hooks/useSession"
import ProfileContent from "@/components/profile/ProfileContent"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isLoggingOut, isLoadingUser } = useSession()

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
