import { X } from "lucide-react"
import { useSearchStore } from "@/store/searchStore"

export default function FilterDrawer({
  categories
}: {
  categories: { id: number; name: string }[]
}) {
  const { filterOpen, closeFilter, category, setCategory } = useSearchStore()

  if (!filterOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40">
      <div className="h-full w-full max-w-sm bg-white p-6 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#ff3f6c]">
              Refine
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Shop by category
            </h2>
          </div>
          <button
            type="button"
            onClick={closeFilter}
            className="rounded-full border border-slate-200 p-2 text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setCategory("")
              closeFilter()
            }}
            className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
              category === ""
                ? "border-[#ff3f6c] bg-[#fff1f4] text-[#ff3f6c]"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            All categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.name)
                closeFilter()
              }}
              className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                category === cat.name
                  ? "border-[#ff3f6c] bg-[#fff1f4] text-[#ff3f6c]"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
