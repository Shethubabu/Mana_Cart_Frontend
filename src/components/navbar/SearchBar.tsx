import { Search, SlidersHorizontal } from "lucide-react"
import { searchSchema } from "@/lib/validation"

export default function SearchBar({
  value,
  setValue,
  openFilter
}: {
  value: string
  setValue: (value: string) => void
  openFilter: () => void
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <button
        type="button"
        onClick={openFilter}
        className="inline-flex rounded-full border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-[#ff3f6c] hover:text-[#ff3f6c]"
      >
        <SlidersHorizontal size={18} />
      </button>

      <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value
            const result = searchSchema.safeParse({ query: nextValue })

            if (result.success) {
              setValue(result.data.query)
              return
            }

            const tooLong = result.error.issues.some(
              (issue) => issue.code === "too_big"
            )

            if (!tooLong) {
              setValue(nextValue)
            }
          }}
          placeholder="Search for beauty groceries and more"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  )
}
