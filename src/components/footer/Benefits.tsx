import { BadgeCheck, Headphones, RotateCcw, Truck } from "lucide-react"

const benefits = [
  { icon: Truck, title: "Express delivery", copy: "Rapid dispatch on every order." },
  {
    icon: BadgeCheck,
    title: "Trusted products",
    copy: "Reliable picks across every category."
  },
  { icon: RotateCcw, title: "Easy returns", copy: "Simple returns on eligible orders." },
  { icon: Headphones, title: "Always-on support", copy: "Responsive help when you need it." }
]

export default function Benefits() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-2 xl:grid-cols-4 lg:px-6">
      {benefits.map((item) => (
        <div
          key={item.title}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_15px_40px_rgba(15,23,42,0.05)]"
        >
          <item.icon className="text-[#ff3f6c]" size={22} />
          <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
        </div>
      ))}
    </section>
  )
}
