import { Menu, Search, User, ShoppingCart } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">

      <Menu className="cursor-pointer"/>

      <h1 className="text-2xl font-bold">
        Mana<span className="text-orange-500">Cart</span>
      </h1>

      <div className="flex items-center gap-6">

        <Search className="cursor-pointer"/>

        <User className="cursor-pointer"/>

        <div className="relative">
          <ShoppingCart className="cursor-pointer"/>
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1 rounded-full">
            0
          </span>
        </div>

      </div>

    </nav>
  )
}