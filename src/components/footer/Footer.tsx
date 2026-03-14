import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 lg:px-6">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-950">
            Mana<span className="text-[#ff3f6c]">Cart</span>
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
            ManaCart is built for a broader ecommerce catalog, from electronics
            and home essentials to beauty, groceries, fashion, and more.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-950">Shop</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <Link to="/products" className="block">
              Browse products
            </Link>
            <Link to="/wishlist" className="block">
              Saved items
            </Link>
            <Link to="/cart" className="block">
              Cart
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-950">Account</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <Link to="/profile" className="block">
              Profile
            </Link>
            <Link to="/orders" className="block">
              Orders
            </Link>
            <Link to="/login" className="block">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
