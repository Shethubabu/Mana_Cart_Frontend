import { Link } from "react-router-dom"

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="grid gap-6 rounded-[2rem] bg-slate-950 p-8 text-white md:grid-cols-[1.4fr_1fr] md:p-12">
        <div>
          <p className="text-xs font-black text-[#ffd166]">
            Member first
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight leading-tight md:text-5xl">
            Unlock fast-fashion deals with your ManaCart profile
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Personalized offers, shorter checkout, saved wishlist picks, and
            launch alerts designed to feel close to a leading fashion marketplace.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-full bg-[#ff3f6c] px-6 py-3 text-sm font-semibold"
            >
              Join now
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold"
            >
              Browse styles
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] bg-white/8 p-5">
          <div className="rounded-[1.4rem] bg-white/10 p-5">
            <p className="text-xs font-semibold text-slate-300">
              Extra 20% off
            </p>
            <p className="mt-3 text-2xl font-black tracking-tight">Launch weekend</p>
          </div>
          <div className="rounded-[1.4rem] bg-white/10 p-5">
            <p className="text-xs font-semibold text-slate-300">
              Easy checkout
            </p>
            <p className="mt-3 text-2xl font-black tracking-tight">Cart to order in seconds</p>
          </div>
        </div>
      </div>
    </section>
  )
}
