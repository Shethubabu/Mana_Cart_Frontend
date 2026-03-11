import ProductCard from "./ProductCard"

export default function FeaturedProducts() {

  const products = [
    {
      id: 1,
      name: "Stylish Jacket",
      price: 89,
      image:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    },
    {
      id: 2,
      name: "Summer Shirt",
      price: 49,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    },
    {
      id: 3,
      name: "Sneakers",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    },
    {
      id: 4,
      name: "Leather Bag",
      price: 150,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    },
  ]

  return (
    <section className="py-12 px-6">

      <h2 className="text-3xl font-bold mb-8">
        Featured Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

      </div>

    </section>
  )
}