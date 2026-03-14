import { CheckCircle2, Info, X, XCircle } from "lucide-react"
import { useToastStore } from "@/store/toastStore"

const toneStyles = {
  success: {
    icon: CheckCircle2,
    iconClassName: "text-emerald-600",
    borderClassName: "border-emerald-200",
    bgClassName: "bg-white"
  },
  error: {
    icon: XCircle,
    iconClassName: "text-rose-600",
    borderClassName: "border-rose-200",
    bgClassName: "bg-white"
  },
  info: {
    icon: Info,
    iconClassName: "text-sky-600",
    borderClassName: "border-slate-200",
    bgClassName: "bg-white"
  }
} as const

export default function Toaster() {
  const items = useToastStore((state) => state.items)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-3 sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-[380px]">
      {items.map((toast) => {
        const tone = toneStyles[toast.tone]
        const Icon = tone.icon

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-3xl border ${tone.borderClassName} ${tone.bgClassName} p-4 shadow-[0_20px_50px_rgba(15,23,42,0.14)] backdrop-blur data-[state=open]:animate-in data-[state=open]:slide-in-from-right-5`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${tone.iconClassName}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
