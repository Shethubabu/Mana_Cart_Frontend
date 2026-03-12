import { useHome } from "@/hooks/useHome"

export default function Categories() {

  const { data } = useHome()

  const categories = data?.categories || []

  return (

    <section className="py-14 px-10 bg-gray-50">

      <h2 className="text-3xl font-bold mb-10">
        Shop Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

        {categories.map((cat:any)=>(
          
          <div
            key={cat.id}
            className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-xl transition"
          >

            <img
              src={`https://source.unsplash.com/400x300/?${cat.name}`}
              className="h-[160px] w-full object-cover"
            />

            <div className="p-3 text-center font-semibold">

              {cat.name}

            </div>

          </div>

        ))}

      </div>

    </section>

  )

}