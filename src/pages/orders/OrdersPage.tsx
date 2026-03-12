import { PackageCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { useOrders } from "@/hooks/useOrders"
import { formatCompactDate, formatCurrency, getProductImage } from "@/lib/format"

export default function OrdersPage() {
  const { orders, isLoading } = useOrders()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff3f6c]">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase text-slate-950">
          Purchase history
        </h1>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-500">Loading orders...</p>
        ) : orders.length ? (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[1.75rem] border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order.id}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Placed on {formatCompactDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-full bg-[#edfdf5] px-4 py-2 text-sm font-semibold text-[#027a48]">
                    {order.status}
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid items-center gap-4 md:grid-cols-[88px_1fr_auto]"
                    >
                      <div className="rounded-[1rem] bg-[#f7f7fb] p-3">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.title}
                          className="h-16 w-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.product.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-slate-200 pt-5 text-right text-base font-black text-slate-950">
                  Total: {formatCurrency(order.total)}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] bg-[#f7f7fb] p-10 text-center">
            <PackageCheck className="mx-auto text-slate-400" size={28} />
            <h2 className="mt-4 text-2xl font-black uppercase text-slate-950">
              No orders yet
            </h2>
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
            >
              Start shopping
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
