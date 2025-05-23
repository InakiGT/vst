export const dynamic = 'force-dynamic'

import Backward from '@/app/components/Backward'
import EnrollButtons from '@/app/components/EnrollButtons'
import Map from '@/app/components/Map'
import NeedKardexPhoto from '@/app/components/NeedKardexPhoto'
import { fetchEnrolledUserByItineraryId, fetchItineraryById, fetchKardexPhotoByEmail } from '@/app/lib/data'
import { reverseGeocode } from '@/app/lib/utils'
import { doto } from '@/fonts'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const itinerary = await fetchItineraryById(id)
  const coords = {
    lat: itinerary?.location.y ?? 0,
    lng: itinerary?.location.x ?? 0,
  }

  if ( !itinerary ) {
    notFound()
  }

  const kardexPhoto = await fetchKardexPhotoByEmail()
  if ( !kardexPhoto ) return <NeedKardexPhoto />

  const location = await reverseGeocode(coords.lat, coords.lng)

  const isEnrolled = async (): Promise<boolean> => {
    const v = await fetchEnrolledUserByItineraryId(itinerary.id)

    return v?.itinerary_id !== undefined && v.user_email !== ''
  }

  return (
    <>
      <Backward title={`Itinerarios / ${ itinerary.id }`} />

      <section className="bg-main-black rounded-sm h-10/12 shadow-lg shadow-black grid grid-cols-2">
        <aside className="px-20 py-12 h-full border-r-borders border-r-1 overflow-auto">
          <h2 className='text-3xl font-bold'>Información del itinerario</h2>
          <span className={`${ itinerary.status === 'a' ? 'bg-green-600' : 'bg-red-400' } text-lg px-2 py-1 font-bold rounded-lg`}>{ itinerary.status === 'a' ? 'Activo' : 'Suspendido' }</span>
          <div className='mt-2 border-b-borders pb-4 border-b-1 flex flex-col gap-2'>
            <h3 className='text-2xl mb-2'>Información del vehículo</h3>
            <p className='text-xl font-bold'>Placas: <span className='font-light'>{ itinerary.plate }</span></p>
            <p className='text-xl font-bold'>Color: <span className='font-light'>{ itinerary.color }</span></p>
          </div>
          <div className='mt-2 border-b-borders pb-4 border-b-1 flex flex-col gap-2'>
            <h3 className='text-2xl mb-1'>Información del viaje</h3>
            <p className='text-xl font-bold'>Dirección: <span className='font-light uppercase'>{ itinerary.direction }</span></p>
            <p className='text-xl font-bold'>Ubicación: <span className='font-light'>{ location}</span></p>
            <p className='text-xl font-bold'>Hora de salida: <span className='font-light'>{ itinerary.hour }</span></p>
            <p className='text-xl font-bold'>Periodicidad: <span className={`${doto.className} text-2xl uppercase`}>{[
              itinerary.days.includes('l') ? 'L' : '_',
              itinerary.days.includes('ma') ? 'M' : '_',
              itinerary.days.includes('mi') ? 'M' : '_',
              itinerary.days.includes('j') ? 'J' : '_',
              itinerary.days.includes('v') ? 'V' : '_',
            ].join('')}</span></p>
            <p className='text-xl font-bold'>Capacidad: <span className='font-light'>{ itinerary.capacity }</span></p>
          </div>
          <div className='mt-2 border-b-borders pb-4 border-b-1 flex flex-col gap-2'>
            <h3 className='text-2xl mb-2'>Información del conductor</h3>
            <p className='text-xl font-bold'>Nombre: <span className='font-light'>{ itinerary.name }</span></p>
            <p className='text-xl font-bold'>Correo: <span className='font-light'>{ itinerary.email }</span></p>
            <p className='text-xl font-bold'>Foto de kardex: <Image src={ itinerary.kardex_photo } alt={`Foto del kardex del conductor ${ itinerary.name }`} width={ 300 } height={ 400 } className='rounded-sm mt-2' /></p>
          </div>
          <div className='mt-2'>
            <h3 className='text-2xl mb-2'>{ await isEnrolled() ? 'Salirse del itinerario' : '¿Unirse al itinerario?' }</h3>
            <EnrollButtons itineraryId={ itinerary.id } quantity={ itinerary.capacity } active={ itinerary.status } enrolled={ await isEnrolled() } />
          </div>
        </aside>
        <aside className="px-20 py-12 h-full flex items-center justify-center">
          <Map start={ coords } />
        </aside>
      </section>
    </>
  )
}
