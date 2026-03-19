import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useHome } from "@/hooks/useHome"
import { formatCurrency, getProductImage } from "@/lib/format"

export default function HeroCarousel() {
  const { data } = useHome()
  const [index, setIndex] = useState(0)

  const slides = data?.featuredProducts || []

  useEffect(() => {
    if (slides.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  if (!slides.length) {
    return null
  }

  const showPrev = () => {
    setIndex((current) => (current - 1 + slides.length) % slides.length)
  }

  const showNext = () => {
    setIndex((current) => (current + 1) % slides.length)
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:gap-6 lg:grid-cols-[1.8fr_1fr] lg:px-6">
      <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#f7d8df] sm:min-h-[560px] lg:min-h-[540px]">
        {slides.map((product, slideIndex) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div className="grid h-full grid-rows-[220px_1fr] gap-4 p-6 sm:grid-rows-[280px_1fr] sm:gap-6 sm:p-8 md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-8 md:p-12">
              <div className="order-2 flex min-h-0 flex-col justify-center md:order-1">
                <p className="text-xs font-black text-[#ff3f6c]">Featured pick</p>
                <h1 className="mt-4 line-clamp-2 min-h-[4rem] max-w-md text-3xl font-black leading-none tracking-tight text-slate-950 sm:min-h-[5rem] sm:text-4xl md:min-h-[7.5rem] md:text-5xl lg:text-6xl">
                  {product.title}
                </h1>
                <p className="mt-4 min-h-[4.5rem] max-w-md text-sm leading-6 text-slate-700 md:min-h-[5rem] md:text-base">
                  Discover better prices, faster delivery, and smoother checkout
                  across electronics, home, beauty, fashion, and everyday needs.
                </p>
                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <Link
                    to={`/product/${product.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
                  >
                    Shop now
                    <ArrowRight size={16} />
                  </Link>
                  <p className="text-lg font-bold text-slate-900">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>

              <div className="relative order-1 flex h-full items-center justify-center md:order-2">
                <div className="absolute inset-6 rounded-full bg-white/45 blur-3xl" />
                <img
                  src={getProductImage(product)}
                  alt={product.title}
                  className="relative z-10 mx-auto h-[200px] w-full object-contain drop-shadow-[0_24px_45px_rgba(15,23,42,0.22)] sm:h-[240px] md:h-[360px] lg:h-[420px]"
                />
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous featured product"
              className="absolute bottom-4 left-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/85 text-slate-950 shadow-lg backdrop-blur transition duration-300 hover:-translate-x-1 hover:scale-105 hover:bg-white active:scale-95 sm:bottom-6 sm:left-6 sm:h-12 sm:w-12"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next featured product"
              className="absolute bottom-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/85 text-slate-950 shadow-lg backdrop-blur transition duration-300 hover:translate-x-1 hover:scale-105 hover:bg-white active:scale-95 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
            >
              <ArrowRight size={18} />
            </button>
          </>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {data?.latestProducts?.slice(0, 2).map((product, cardIndex) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className={`overflow-hidden rounded-[2rem] p-5 sm:p-6 ${
              cardIndex === 0 ? "bg-[#d4f3ea]" : "bg-[#dfe7ff]"
            }`}
          >
            <p className="text-xs font-black text-slate-700">Fresh arrival</p>
            <h2 className="mt-3 text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-2xl">
              {product.title}
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              New products with daily deal pricing.
            </p>
            <img
              src={getProductImage(product)}
              alt={product.title}
              className="mt-4 h-40 w-full object-contain sm:h-52"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
