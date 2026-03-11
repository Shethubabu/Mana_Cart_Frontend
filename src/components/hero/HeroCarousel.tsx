import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export default function HeroCarousel() {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      title: "Discover Your Style",
      subtitle: "Up to 40% off new arrivals",
    },
    {
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      title: "Summer Collection",
      subtitle: "Fresh looks for every day",
    },
  ]

  return (
    <div className="w-full">
      <Carousel>
        <CarouselContent>

          {slides.map((slide, index) => (
            <CarouselItem key={index}>

              <div className="relative h-[450px] w-full">

                <img
                  src={slide.image}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">

                  <h2 className="text-4xl font-bold">
                    {slide.title}
                  </h2>

                  <p className="mt-3 text-lg">
                    {slide.subtitle}
                  </p>

                  <button className="mt-6 bg-orange-500 px-6 py-2 rounded-lg">
                    Shop Now
                  </button>

                </div>

              </div>

            </CarouselItem>
          ))}

        </CarouselContent>
      </Carousel>
    </div>
  )
}