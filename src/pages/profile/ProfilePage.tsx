import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@/hooks/useSession"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isLoggingOut } = useSession()

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase text-slate-950">
          Hello, {user.name}
        </h1>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-2 text-lg font-bold text-slate-950">{user.name}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-lg font-bold text-slate-950">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/orders"
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
          >
            View orders
          </Link>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={async () => {
              await logout()
              navigate("/")
            }}
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-700"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </section>
    </div>
  )
}
