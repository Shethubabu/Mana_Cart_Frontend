import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@/hooks/useSession"
import { getFieldErrors, registerSchema } from "@/lib/validation"
import { pushToast } from "@/store/toastStore"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isRegistering } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    const result = registerSchema.safeParse({ name, email, password })

    if (!result.success) {
      const errors = getFieldErrors<"name" | "email" | "password">(result.error)
      setFieldErrors(errors)
      setError("Correct the highlighted fields and try again.")
      return
    }

    setFieldErrors({})

    try {
      await register(result.data)
      pushToast({
        tone: "success",
        title: "Account created",
        description: "You are now logged in."
      })
      navigate("/")
    } catch {
      setError("Unable to create account. Try a different email.")
      pushToast({
        tone: "error",
        title: "Registration failed",
        description: "Unable to create account. Try a different email."
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1fr_0.95fr]">
        <div className="hidden bg-gradient-to-br from-[#ffedf2] via-[#fff7df] to-[#e8efff] p-10 lg:block">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#ff3f6c]">
            New account
          </p>
          <h1 className="mt-6 text-5xl font-black uppercase leading-none text-slate-950">
            Join ManaCart today
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-700">
            Register once to unlock cart sync, order history, and faster repeat
            purchases.
          </p>
        </div>

        <form onSubmit={submit} className="p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ff3f6c]">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase text-slate-950">
            Create account
          </h2>

          <div className="mt-8 space-y-4">
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (fieldErrors.name) {
                  setFieldErrors((current) => ({ ...current, name: undefined }))
                }
              }}
              placeholder="Full name"
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${
                fieldErrors.name ? "border-[#ff3f6c]" : "border-slate-200"
              }`}
            />
            {fieldErrors.name ? (
              <p className="-mt-2 text-sm text-[#ff3f6c]">{fieldErrors.name}</p>
            ) : null}
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
            disabled={isRegistering}
            className="mt-6 w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
          >
            {isRegistering ? "Creating..." : "Register"}
          </button>

          <p className="mt-6 text-sm text-slate-600">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-[#ff3f6c]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
