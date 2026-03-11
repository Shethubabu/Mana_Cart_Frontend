export default function Newsletter() {
  return (
    <div className="bg-gray-100 py-12 text-center">

      <h2 className="text-2xl font-bold">
        Stay in the Loop
      </h2>

      <p className="text-gray-500 mt-2">
        Subscribe for updates and offers
      </p>

      <div className="mt-4 flex justify-center">

        <input
          placeholder="Enter your email"
          className="px-4 py-2 border rounded-l-lg"
        />

        <button className="bg-orange-500 text-white px-6 rounded-r-lg">
          Subscribe
        </button>

      </div>

    </div>
  )
}