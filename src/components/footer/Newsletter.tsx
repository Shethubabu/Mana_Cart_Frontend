export default function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="rounded-[2rem] bg-gradient-to-r from-[#fff1f4] via-white to-[#eef4ff] p-8 md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-black text-[#ff3f6c]">
            Inbox access
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Get trend alerts, drops, and weekend offers
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Subscribe for launch notifications and style-led deal updates.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Enter your email"
            className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none"
          />
          <button className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}
