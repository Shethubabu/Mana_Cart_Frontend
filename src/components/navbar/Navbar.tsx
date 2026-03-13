import { useEffect, useMemo, useState } from "react"
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import SearchBar from "@/components/navbar/SearchBar"
import { useCart } from "@/hooks/useCart"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useSearchStore } from "@/store/searchStore"
import { useSession } from "@/hooks/useSession"
import { useWishlistStore } from "@/store/wishlistStore"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { items } = useCart()
  const { user } = useSession()
  const wishlistItems = useWishlistStore((state) => state.items)
  const { search, setSearch, openFilter } = useSearchStore()
  const [draftSearch, setDraftSearch] = useState(search)
  const debouncedSearch = useDebouncedValue(draftSearch, 400)

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  useEffect(() => {
    setDraftSearch(search)
  }, [search])

  useEffect(() => {
    const normalizedDraft = debouncedSearch.trim()
    const normalizedSearch = search.trim()

    if (normalizedDraft === normalizedSearch) {
      return
    }

    setSearch(debouncedSearch)

    if (location.pathname !== "/products") {
      navigate("/products")
    }
  }, [debouncedSearch, location.pathname, navigate, search, setSearch])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-6">
        <button
          type="button"
          className="inline-flex rounded-full border border-slate-200 p-2 text-slate-600 md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="shrink-0">
          <div className="text-2xl font-black tracking-tight text-slate-900">
            Mana<span className="text-[#ff3f6c]">Cart</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink
            to="/products"
            className="text-sm font-semibold text-slate-700 transition hover:text-[#ff3f6c]"
          >
            Products
          </NavLink>
          {user && (
            <NavLink
              to="/orders"
              className="text-sm font-semibold text-slate-700 transition hover:text-[#ff3f6c]"
            >
              Orders
            </NavLink>
          )}
        </nav>

        <div className="mx-auto hidden max-w-2xl flex-1 md:flex">
          <SearchBar
            value={draftSearch}
            setValue={setDraftSearch}
            openFilter={() => {
              openFilter()
              navigate("/products")
            }}
          />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Link
            to={user ? "/profile" : "/login"}
            className="flex flex-col items-center text-xs font-medium text-slate-700 transition hover:text-[#ff3f6c]"
          >
            <User size={19} />
            <span>{user ? "Account" : "Login"}</span>
          </Link>

          <Link
            to="/wishlist"
            className="relative flex flex-col items-center text-xs font-medium text-slate-700 transition hover:text-[#ff3f6c]"
          >
            <Heart size={19} />
            <span>Wishlist</span>
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-slate-950 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-xs font-medium text-slate-700 transition hover:text-[#ff3f6c]"
          >
            <ShoppingBag size={19} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-[#ff3f6c] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <SearchBar
          value={draftSearch}
          setValue={setDraftSearch}
          openFilter={() => {
            openFilter()
            navigate("/products")
          }}
        />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/35 md:hidden">
          <div className="h-full w-[84%] max-w-sm bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="text-lg font-bold uppercase tracking-[0.22em]">
                Menu
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <NavLink
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold text-slate-700"
              >
                Products
              </NavLink>
              {user && (
                <NavLink
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold text-slate-700"
                >
                  Orders
                </NavLink>
              )}
              <NavLink
                to={user ? "/profile" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold text-slate-700"
              >
                {user ? "Profile" : "Login"}
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
