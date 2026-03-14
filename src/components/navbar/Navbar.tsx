import { useEffect, useMemo, useState } from "react"
import { Heart, Menu, Package, ShoppingBag, User } from "lucide-react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import SearchBar from "@/components/navbar/SearchBar"
import { useCart } from "@/hooks/useCart"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useSearchStore } from "@/store/searchStore"
import { useSession } from "@/hooks/useSession"
import { useWishlistStore } from "@/store/wishlistStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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

  const mobileLinks = [
    { to: "/products", label: "Browse products", show: true, icon: ShoppingBag },
    { to: "/wishlist", label: "Saved items", show: true, icon: Heart },
    { to: "/orders", label: "Orders", show: Boolean(user), icon: Package },
    { to: user ? "/profile" : "/login", label: user ? "Profile" : "Login", show: true, icon: User }
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 lg:px-6">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} />
        </Button>

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
          {user ? (
            <NavLink
              to="/orders"
              className="text-sm font-semibold text-slate-700 transition hover:text-[#ff3f6c]"
            >
              Orders
            </NavLink>
          ) : null}
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

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            to={user ? "/profile" : "/login"}
            className="flex flex-col items-center text-[11px] font-medium text-slate-700 transition hover:text-[#ff3f6c] sm:text-xs"
          >
            <User size={19} />
            <span>{user ? "Account" : "Login"}</span>
          </Link>

          <Link
            to="/wishlist"
            className="relative flex flex-col items-center text-[11px] font-medium text-slate-700 transition hover:text-[#ff3f6c] sm:text-xs"
          >
            <Heart size={19} />
            <span>Saved</span>
            {wishlistItems.length > 0 ? (
              <span className="absolute -right-2 -top-2 rounded-full bg-slate-950 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {wishlistItems.length}
              </span>
            ) : null}
          </Link>

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-[11px] font-medium text-slate-700 transition hover:text-[#ff3f6c] sm:text-xs"
          >
            <ShoppingBag size={19} />
            <span>Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 rounded-full bg-[#ff3f6c] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
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

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="left-0 top-0 h-screen max-w-[86vw] translate-x-0 translate-y-0 rounded-none border-r border-slate-200 bg-white p-0 sm:max-w-sm">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle className="text-xl font-black text-slate-950">
              Menu
            </DialogTitle>
            <DialogDescription>
              Move quickly between products, saved items, orders, and your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-4 py-5">
            {mobileLinks
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon

                return (
                  <Button
                    key={item.to}
                    asChild
                    variant="outline"
                    className="h-14 w-full justify-start rounded-2xl px-4"
                  >
                    <NavLink to={item.to} onClick={() => setMobileOpen(false)}>
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  </Button>
                )
              })}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
