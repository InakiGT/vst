export const dynamic = 'force-dynamic'

import { fetchItinerariesByUser } from '@/app/lib/data'
import { reverseGeocode } from '@/app/lib/utils'
import { ItineraryFromDb } from '@/app/lib/definitions'
import MyItineraries from '@/app/components/MyItineraries'

export type MyItinerary = Omit <ItineraryFromDb, 'status'> & {
  location_name: string,
  status: 'aceptada' | 'rechazada' | 'pendiente'
}

export default async function Page() {
  const itineraries = await fetchItinerariesByUser()

  const itinerariesWithLocation = await Promise.all(
    itineraries.map(async (itinerary) => ({
      ...itinerary,
      location_name: await reverseGeocode(itinerary.location.y, itinerary.location.x, 'name'),
    }))
  )

  return (
    <>
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold">Mis itinerarios <br /><span className='text-lg font-light'>Itinerarios a los que estoy inscrito</span></h1>
    </div>
    <section className="bg-main-black rounded-sm px-8 py-6 h-10/12 shadow-lg shadow-black relative">
    <header className="bg bg-borders/80 rounded-2xl py-1 px-6 font-light mb-5 shadow-sm shadow-black absolute z-100 top-3 left-6 right-6">
        <ul className="grid grid-cols-7 gap-4 text-xl">
          <li>Destino</li>
          <li>Ruta</li>
          <li>Horario</li>
          <li>Lugares</li>
          <li>Días</li>
          <li>Mi estado</li>
          <li>Acciones</li>
        </ul>
    </header>
      <div className="h-full pt-10 overflow-scroll">
        <MyItineraries itineraries={ itinerariesWithLocation } />
      </div>
      </section>
    </>
  )
}
