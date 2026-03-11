export default function Benefits() {

  const items = [
    "Free Shipping",
    "Secure Payment",
    "Easy Returns",
    "24/7 Support",
  ]

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 text-center py-10 border-t">

      {items.map((item, i) => (
        <div key={i} className="p-4 font-medium">
          {item}
        </div>
      ))}

    </section>
  )
}