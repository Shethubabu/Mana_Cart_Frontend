import { Link } from "react-router-dom"

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="grid gap-6 rounded-[2rem] bg-slate-950 p-8 text-white md:grid-cols-[1.4fr_1fr] md:p-12">
        <div>
          <p className="text-xs font-black text-[#ffd166]">Built for repeat shopping</p>
          <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Save addresses, track orders, and move through checkout faster
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Keep the essentials that matter in a modern ecommerce flow:
            responsive browsing, account-aware checkout, and quick access to
            the products you want to reorder.
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
              Browse products
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] bg-white/8 p-5">
          <div className="rounded-[1.4rem] bg-white/10 p-5">
            <p className="text-xs font-semibold text-slate-300">Better value</p>
            <p className="mt-3 text-2xl font-black tracking-tight">Offers across every category</p>
          </div>
          <div className="rounded-[1.4rem] bg-white/10 p-5">
            <p className="text-xs font-semibold text-slate-300">Easy checkout</p>
            <p className="mt-3 text-2xl font-black tracking-tight">Cart to order in seconds</p>
          </div>
        </div>
      </div>
    </section>
  )
}
