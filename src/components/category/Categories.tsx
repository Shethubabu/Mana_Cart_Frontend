export default function Categories() {
  const categories = [
    {
      name: "Women",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    },
    {
      name: "Men",
      image:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    },
    {
      name: "Accessories",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    },
    {
      name: "Footwear",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    },
  ]

  return (
    <section className="py-12 px-6">

      <h2 className="text-3xl font-bold mb-8">
        Shop Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {categories.map((cat, i) => (

          <div
            key={i}
            className="relative group cursor-pointer rounded-xl overflow-hidden"
          >

            <img
              src={cat.image}
              className="h-[200px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-semibold group-hover:bg-black/60 transition">

              {cat.name}

            </div>

          </div>

        ))}

      </div>

    </section>
  )
}