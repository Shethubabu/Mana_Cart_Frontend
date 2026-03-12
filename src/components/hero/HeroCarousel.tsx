import { useHome } from "@/hooks/useHome"
import { useEffect, useState } from "react"

export default function HeroCarousel() {

  const { data } = useHome()
  const [index, setIndex] = useState(0)

  const slides = data?.featuredProducts?.slice(0,4) || []

  useEffect(() => {

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(timer)

  }, [slides.length])

  if (!slides.length) return null

  return (

    <div className="relative h-[500px] w-full overflow-hidden">

      {slides.map((product:any,i:number)=>(
        
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >

          <img
            src={product.images?.[0]?.url}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">

            <h2 className="text-4xl font-bold">
              {product.title}
            </h2>

            <p className="mt-3 text-lg">
              ${product.price}
            </p>

          </div>

        </div>

      ))}

    </div>

  )

}