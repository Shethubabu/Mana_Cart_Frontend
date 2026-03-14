import { SlidersHorizontal } from "lucide-react"
import { useSearchStore } from "@/store/searchStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function FilterDrawer({
  categories
}: {
  categories: { id: number; name: string }[]
}) {
  const { filterOpen, closeFilter, category, setCategory } = useSearchStore()

  return (
    <Dialog open={filterOpen} onOpenChange={(open) => !open && closeFilter()}>
      <DialogContent className="left-auto right-0 top-0 h-screen max-w-sm translate-x-0 translate-y-0 rounded-none border-l border-slate-200 bg-white p-0 sm:max-w-sm">
        <DialogHeader className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#ff3f6c]">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-950">
                Filters
              </DialogTitle>
              <DialogDescription>
                Pick a category to refine the product catalog.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 overflow-y-auto px-6 py-6">
          <Button
            type="button"
            variant={category === "" ? "secondary" : "outline"}
            className="h-auto w-full justify-start rounded-2xl px-4 py-3 text-left"
            onClick={() => {
              setCategory("")
              closeFilter()
            }}
          >
            All categories
          </Button>

          {categories.map((cat) => (
            <Button
              key={cat.id}
              type="button"
              variant={category === cat.name ? "secondary" : "outline"}
              className="h-auto w-full justify-start rounded-2xl px-4 py-3 text-left"
              onClick={() => {
                setCategory(cat.name)
                closeFilter()
              }}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
