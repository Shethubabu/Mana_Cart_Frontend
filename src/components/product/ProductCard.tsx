import { Link } from "react-router-dom"

export default function ProductCard({ product }: { product:any }) {

  return (

    <Link to={`/product/${product.id}`}>

      <div className="bg-white border rounded-lg p-4 hover:shadow-2xl transition group">

        <img
          src={product.image}
          className="h-[220px] w-full object-contain group-hover:scale-105 transition"
        />

        <h3 className="mt-3 text-sm font-semibold line-clamp-2">

          {product.name}

        </h3>

        <p className="text-lg font-bold mt-2">

          ${product.price}

        </p>

        <p className="text-green-600 text-sm">

          Free Delivery

        </p>

      </div>

    </Link>

  )

}