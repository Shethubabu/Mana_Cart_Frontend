import { ShoppingCart } from "lucide-react"

export default function ProductCard({
  product,
}: {
  product: any
}) {
  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-lg transition">

      <img
        src={product.image}
        className="h-[250px] w-full object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold text-lg">
          {product.name}
        </h3>

        <p className="text-gray-500">
          ${product.price}
        </p>

        <button className="mt-3 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg">

          <ShoppingCart size={18} />

          Add to Cart

        </button>

      </div>

    </div>
  )
}