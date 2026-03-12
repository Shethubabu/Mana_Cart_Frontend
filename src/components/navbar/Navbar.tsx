import { Menu, Search, User, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { useCartStore } from "@/store/cartStore"

export default function Navbar() {

  const items = useCartStore((state) => state.items)

  return (

    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">

      {/* Logo */}

      <div className="flex items-center gap-4">

        <Menu className="cursor-pointer md:hidden" />

        <Link to="/">

          <h1 className="text-2xl font-bold">
            Mana<span className="text-orange-500">Cart</span>
          </h1>

        </Link>

      </div>

      {/* Navigation */}

      <div className="hidden md:flex items-center gap-8 font-medium">

        <Link
          to="/"
          className="hover:text-orange-500 transition"
        >
          Home
        </Link>

        <Link
          to="/products"
          className="hover:text-orange-500 transition"
        >
          Products
        </Link>

      </div>

      {/* Search */}

      <div className="hidden md:flex items-center w-[35%] bg-gray-100 rounded-lg px-3">

        <Search className="text-gray-500" />

        <input
          placeholder="Search products..."
          className="bg-transparent outline-none px-3 py-2 w-full"
        />

      </div>

      {/* Icons */}

      <div className="flex items-center gap-6">

        <User className="cursor-pointer" />

        <Link to="/cart">

          <div className="relative">

            <ShoppingCart className="cursor-pointer" />

            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1 rounded-full">

              {items.length}

            </span>

          </div>

        </Link>

      </div>

    </nav>

  )

}