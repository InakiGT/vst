export const dynamic = 'force-dynamic'

import Backward from '@/app/components/Backward'
import NeedKardexPhoto from '@/app/components/NeedKardexPhoto'
import NewItineraryForm from '@/app/components/NewItineraryForm'
import { fetchKardexPhotoByEmail } from '@/app/lib/data'

export default async function Page() {
  const kardexPhoto = await fetchKardexPhotoByEmail()

  if ( !kardexPhoto ) return <NeedKardexPhoto />

  return (
    <>
      <Backward title='Itinerarios / Nuevo Itinerario' />

      <section className="bg-main-black rounded-sm h-10/12 shadow-lg shadow-black grid grid-cols-2">
        <NewItineraryForm />
      </section>
    </>
  )
}
