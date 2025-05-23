import Backward from '@/app/components/Backward'
import UpdateItineraryForm from '@/app/components/UpdateItineraryForm'
import { fetchEnrolledUsersByItineraryId, fetchItineraryById } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const itinerary = await fetchItineraryById(id)
  const users = await fetchEnrolledUsersByItineraryId(id)

  if ( !itinerary ) notFound()

  return (
    <>
      <Backward title={`Itinerarios / Editar itinerario ${ id }`} />

      <UpdateItineraryForm itinerary={ itinerary } users={ users } />
    </>
  )
}
