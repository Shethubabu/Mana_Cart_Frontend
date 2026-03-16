import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useHome } from "@/hooks/useHome"
import { formatCurrency, getProductImage } from "@/lib/format"

export default function HeroCarousel() {
  const { data } = useHome()
  const [index, setIndex] = useState(0)

  const slides = data?.featuredProducts?.slice(0, 4) || []

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

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:gap-6 lg:grid-cols-[1.8fr_1fr] lg:px-6">
      <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#f7d8df] sm:min-h-[560px] lg:min-h-[540px]">
        {slides.map((product, slideIndex) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="grid h-full items-center gap-6 p-6 sm:p-8 md:grid-cols-2 md:gap-8 md:p-12">
              <div className="order-2 md:order-1">
                <p className="text-xs font-black text-[#ff3f6c]">Featured pick</p>
                <h1 className="mt-4 max-w-md text-3xl font-black leading-none tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl">
                  {product.title}
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-700 md:text-base">
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

              <div className="relative order-1 md:order-2">
                <div className="absolute inset-6 rounded-full bg-white/45 blur-3xl" />
                <img
                  src={getProductImage(product)}
                  alt={product.title}
                  className="relative z-10 mx-auto h-[220px] w-full object-contain drop-shadow-[0_24px_45px_rgba(15,23,42,0.22)] sm:h-[280px] md:h-[360px] lg:h-[420px]"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-6 flex gap-2 sm:left-8">
          {slides.map((product, slideIndex) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setIndex(slideIndex)}
              className={`h-2.5 rounded-full transition ${
                slideIndex === index ? "w-8 bg-slate-950" : "w-2.5 bg-white/70"
              }`}
            />
          ))}
        </div>
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
