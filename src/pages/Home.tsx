import HeroCarousel from "@/components/hero/HeroCarousel"
import Categories from "@/components/category/Categories"
import FeaturedProducts from "@/components/product/FeaturedProducts"
import PromoBanner from "@/components/hero/PromoBanner"
import Benefits from "@/components/footer/Benefits"
import Newsletter from "@/components/footer/Newsletter"
import Footer from "@/components/footer/Footer"

export default function Home() {
  return (
    <div>

      <HeroCarousel />

      <Categories />

      <FeaturedProducts />

      <PromoBanner />

      <Benefits />

      <Newsletter />

      <Footer />

    </div>
  )
}