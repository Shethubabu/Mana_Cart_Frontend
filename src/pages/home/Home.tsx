import Benefits from "@/components/footer/Benefits"
import Newsletter from "@/components/footer/Newsletter"
import Categories from "@/components/category/Categories"
import HeroCarousel from "@/components/hero/HeroCarousel"
import PromoBanner from "@/components/hero/PromoBanner"
import FeaturedProducts from "@/components/product/FeaturedProducts"

export default function Home() {
  return (
    <div className="pb-10">
      <HeroCarousel />
      <Categories />
      <FeaturedProducts />
      <PromoBanner />
      <Benefits />
      <Newsletter />
    </div>
  )
}
