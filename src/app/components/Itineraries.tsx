import { doto } from '@/fonts'
import Link from 'next/link'
import { type ItineraryWithLocation } from '@/app/itinerary/page'
import { auth } from '@/auth'

export default async function Itineraries({ itineraries }: { itineraries: ItineraryWithLocation[] }) {
  const session = await auth()
  return (
    <>
      {
        itineraries &&
        itineraries.map(
          itinerary => {
            const { id, direction, hour, capacity, days, status, location_name } = itinerary

            return (
              <ul key={ id } className="grid grid-cols-7 gap-4 items-center py-3 px-5 text-xl border-b-borders border-b-2">
                <li className='uppercase'>{ direction }</li>
                <li className='capitalize'>{ location_name }</li>
                <li>{ hour.split('').slice(0, 5).join('') }</li>
                <li>{ capacity }</li>
                <li className={`${doto.className} text-2xl uppercase`}>  {[
                  days.includes('l') ? 'L' : '_',
                  days.includes('ma') ? 'M' : '_',
                  days.includes('mi') ? 'M' : '_',
                  days.includes('j') ? 'J' : '_',
                  days.includes('v') ? 'V' : '_',
                ].join('')}</li>
                <li className={`${  status === 'a' ? 'text-green-600': 'text-red-400'}`}>{  status === 'a' ? 'Activo' : 'Suspendido'  }</li>
                <li>

                  <Link href={`/itinerary/${ session?.user?.email !== itinerary.email ? '' : '/edit/' }${  id }`} className="font-bold bg-main-blue rounded-sm py-1 px-8 cursor-pointer">Ver</Link>
                </li>
              </ul>
        )})
      }
    </>
    )
}
