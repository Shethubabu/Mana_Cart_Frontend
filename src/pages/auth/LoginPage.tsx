import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@/hooks/useSession"
import { getFieldErrors, loginSchema } from "@/lib/validation"
import { pushToast } from "@/store/toastStore"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoggingIn } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      const errors = getFieldErrors<"email" | "password">(result.error)
      setFieldErrors(errors)
      setError("Correct the highlighted fields and try again.")
      return
    }

    setFieldErrors({})

    try {
      await login(result.data)
      pushToast({
        tone: "success",
        title: "Logged in successfully",
        description: "Your cart and account details are ready."
      })
      navigate("/")
    } catch {
      setError("Invalid credentials. Check your email and password.")
      pushToast({
        tone: "error",
        title: "Login failed",
        description: "Invalid credentials. Check your email and password."
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1fr_0.95fr]">
        <div className="hidden bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#ff3f6c] p-10 text-white lg:block">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#ffd166]">
            ManaCart
          </p>
          <h1 className="mt-6 text-5xl font-black uppercase leading-none">
            Sign in and shop faster
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-200">
            Access your synced cart, orders, and personalized storefront flows.
          </p>
        </div>

        <form onSubmit={submit} className="p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ff3f6c]">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase text-slate-950">
            Login
          </h2>

          <div className="mt-8 space-y-4">
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (fieldErrors.email) {
                  setFieldErrors((current) => ({ ...current, email: undefined }))
                }
              }}
              placeholder="Email"
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${
                fieldErrors.email ? "border-[#ff3f6c]" : "border-slate-200"
              }`}
            />
            {fieldErrors.email ? (
              <p className="-mt-2 text-sm text-[#ff3f6c]">{fieldErrors.email}</p>
            ) : null}
            <input
              value={password}
              type="password"
              onChange={(event) => {
                setPassword(event.target.value)
                if (fieldErrors.password) {
                  setFieldErrors((current) => ({ ...current, password: undefined }))
                }
              }}
              placeholder="Password"
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${
                fieldErrors.password ? "border-[#ff3f6c]" : "border-slate-200"
              }`}
            />
            {fieldErrors.password ? (
              <p className="-mt-2 text-sm text-[#ff3f6c]">{fieldErrors.password}</p>
            ) : null}
          </div>

          {error && <p className="mt-4 text-sm text-[#ff3f6c]">{error}</p>}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-6 w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
          >
            {isLoggingIn ? "Signing in..." : "Login"}
          </button>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <Link to="/register" className="font-semibold text-[#ff3f6c]">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
