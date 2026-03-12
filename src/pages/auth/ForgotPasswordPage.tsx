import { Link } from "react-router-dom"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)] md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ff3f6c]">
          Password help
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase text-slate-950">
          Reset flow is not available in the current backend
        </h1>
        <p className="mt-5 text-sm leading-7 text-slate-600">
          Your backend currently exposes `register`, `login`, `refresh`, `me`,
          and `logout` endpoints only. If you want, I can add a real forgot
          password flow in the backend next.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}
