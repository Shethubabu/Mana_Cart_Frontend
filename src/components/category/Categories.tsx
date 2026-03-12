import { Link } from "react-router-dom"
import { useHome } from "@/hooks/useHome"
import { useSearchStore } from "@/store/searchStore"

const categoryColors = [
  "from-[#ffe0e9] to-[#fff7df]",
  "from-[#dff5ec] to-[#f4fffa]",
  "from-[#e8e6ff] to-[#f8f7ff]",
  "from-[#dff1ff] to-[#f3fbff]",
  "from-[#fff0dd] to-[#fff8f1]"
]

export default function Categories() {
  const { data } = useHome()
  const setCategory = useSearchStore((state) => state.setCategory)

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-black text-[#ff3f6c]">
            Explore
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Shop by category
          </h2>
        </div>
        <Link
          to="/products"
          className="text-sm font-semibold text-slate-600"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {data?.categories?.slice(0, 10).map((category, index) => (
          <Link
            key={category.id}
            to="/products"
            onClick={() => setCategory(category.name)}
            className={`rounded-[1.75rem] bg-gradient-to-br p-6 transition hover:-translate-y-1 ${categoryColors[index % categoryColors.length]}`}
          >
            <p className="text-xs font-semibold text-slate-600">
              Curated
            </p>
            <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
              {category.name}
            </h3>
            <p className="mt-3 text-sm text-slate-700">
              Elevated picks inspired by fast-moving fashion storefronts.
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
