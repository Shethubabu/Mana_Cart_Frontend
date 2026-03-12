import { useState } from "react"

export default function SearchBar({
  onSearch,
}: {
  onSearch: (value: string) => void
}) {

  const [value, setValue] = useState("")

  return (

    <div className="flex w-full md:w-[400px]">

      <input
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full border px-4 py-2 rounded-l-lg outline-none"
      />

      <button
        onClick={()=>onSearch(value)}
        className="bg-orange-500 text-white px-6 rounded-r-lg"
      >
        Search
      </button>

    </div>

  )

}