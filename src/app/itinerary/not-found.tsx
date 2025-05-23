import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1 className="text-3xl font-bold mb-2">404 | No encontrado</h1>
      <p className="text-xl font-light mb-2">No se encontro la fuente que buscabas, regresa a la lista de los itinerarios</p>
      <Link className="bg-main-blue font-bold text-xl rounded-sm py-2 w-60 my-5 cursor-pointer px-6 mt-2" href='/itinerary'>Itinerarios</Link>
    </main>
  )
}
