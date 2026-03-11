export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">

      <div className="grid md:grid-cols-3 gap-6">

        <div>
          <h3 className="font-bold text-lg">ManaCart</h3>
          <p className="text-gray-400 mt-2">
            Your destination for modern shopping.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="text-gray-400 mt-2 space-y-1">
            <li>Men</li>
            <li>Women</li>
            <li>Accessories</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Help</h4>
          <ul className="text-gray-400 mt-2 space-y-1">
            <li>Contact</li>
            <li>Returns</li>
            <li>Support</li>
          </ul>
        </div>

      </div>

    </footer>
  )
}